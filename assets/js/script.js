var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#task-to-do");
var pageContentEl = document.querySelector("#page-content");
var taskInProgressEl = document.querySelector("#task-in-progress");
var taskCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];
var taskIdCounter = 0;

var taskFormHandler = function(event){
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    
    //check if input values are empty strings
    if(!taskNameInput || !taskTypeInput){
        alert("you need to fill out the task form!");
        return false;
    }
    
    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");
    //has data attribute, so get task id and call function to complete edit process
    if(isEdit){
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId)
    }
    //no data attribute, so create object as normal and pass to createTaskEl function
    else{
        //package up data as an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        //send it as an argument to createTaskEl
        createTaskEl(taskDataObj)
    }
};

var completeEditTask = function(taskName, taskType, taskId){
    //find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='"+taskId+"']");

    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //loop through tasks array and task object with new content
    for(var i = 0; i<tasks.lenght; i++){
        if(task[i].id === parseInt(taskId)){
            tasks[i].name = taskName;
            task[i].type = taskType;
        }
    };
    saveTasks();
    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}
var createTaskEl = function(taskDataObj){
    //create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter)

    //create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    //give it a class name
    taskInfoEl.className = "task-info";
    //add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>"
    
    listItemEl.appendChild(taskInfoEl);

    var taskActionEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionEl);
    //add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);
    saveTasks();
    //increase task counter for next unique id
    taskIdCounter++;
}

var createTaskActions = function(taskId){
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId)

    actionContainerEl.appendChild(deleteButtonEl)

    var statusSelectEl = document.createElement("Select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"]
    for(var i = 0; i < statusChoices.length; i++){
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.setAttribute("value", statusChoices[i]);
        statusOptionEl.textContent = statusChoices[i];
        

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name","status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    return actionContainerEl;
}
var deleteTask = function(taskId){
    var taskSelected = document.querySelector(".task-item[data-task-id='"+taskId +"']");
    var updatedTaskArr = [];
    taskSelected.remove();

    //loop through current tasks
    for(var i = 0; i < task.length; i++){
        //if not deleteing specific task lets keep that task
        if(tasks[i].id !== parseInt(taskId)){
            updatedTaskArr.push(task[i]);
        }
    }
    //reassign tasks array to be the same as updatedTaskAr
    task = updatedTaskArr;

    saveTasks();
}
var editTask = function(taskId){
    //get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='"+taskId+"']");

    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector('#save-task').textContent = "save Task";
    formEl.setAttribute("data-task-id", taskId)
}
var taskStatusChangeHandler = function(event){
    //get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    //get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    //find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='"+taskId+"']");

    if(statusValue === "to do"){
        tasksToDoEl.appendChild(taskSelected);
    }else if(statusValue === "in progress"){
        taskInProgressEl.appendChild(taskSelected);
    }else if(statusValue === "completed"){
        taskCompletedEl.appendChild(taskSelected);
    }
    //update tasks in task array
    for(var i =0; i<tasks.length; i++){
        if(tasks[i].id === parseInt(taskId)){
            tasks[i].status = statusValue;
        }
    }
    saveTasks();
}
var taskButtonHandler = function(event){
    //get target element from event
    var targetEl = event.target;

    //edit button was clicked
    if(targetEl.matches(".edit-btn")){
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    if(event.target.matches(".delete-btn")){
        var taskId = event.target.getAttribute("data-task-id")
        deleteTask(taskId);
    }
};
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
pageContentEl.addEventListener("change",taskStatusChangeHandler)
pageContentEl.addEventListener("click", taskButtonHandler)
formEl.addEventListener("submit", taskFormHandler);