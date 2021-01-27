const addBtn = document.querySelector('#add-button');
const viewSection = document.querySelector('.view-section');

// ---------------- Event Listeners --------------------- // 

addBtn.addEventListener('click', addToDo);

// ---------------- Functions --------------------------- //

function addToDo(event){
    event.preventDefault();
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo-container');

    const todoText = document.createElement('div');
    todoText.classList.add('todo-text');

    const createdAt = document.createElement('div');
    createdAt.classList.add('todo-createdAt');

    const priority = document.createElement('div');
    priority.classList.add('todo-priority')
    
    todoDiv.appendChild(priority);
    todoDiv.appendChild(createdAt);
    todoDiv.appendChild(todoText);

    viewSection.appendChild(todoDiv);

}