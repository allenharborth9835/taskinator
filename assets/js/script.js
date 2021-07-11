var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#task-to-do");

var createTaskHandler = function(event){
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name-'task-type']").value;
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.textContent = taskNameInput;
    tasksToDoEl.appendChild(listItemEl);
};

formEl.addEventListener("submit", createTaskHandler);