const addBtn = document.querySelector('#add-button');
const viewSection = document.querySelector('.view-section');
const todoList =[];

class toDoTask {
    constructor(priority, text, date){
        this.priority = priority;
        this.text = text;
        this.date = date; 
    }
}
// ---------------- Event Listeners --------------------- // 

addBtn.addEventListener('click', addToDo);

// ---------------- Functions --------------------------- //

function addToDo(event){
    event.preventDefault();
    // ----- append the input text to text div ---- //
    let inputElem = document.getElementById('text-input');
    let textInput = inputElem.value;
    if(textInput === ""){
        alert('must add to-do');
        return false;
    }
    
    // ----- clear input field and focus for next input --- //
    inputElem.value = "";
    inputElem.focus();
    
    // ------ create the divs for each To-Do task ------- //
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo-container');
    
    const todoText = document.createElement('div');
    todoText.classList.add('todo-text');
    
    const createdAt = document.createElement('div');
    createdAt.classList.add('todo-createdAt');
    
    const priority = document.createElement('div');
    priority.classList.add('todo-priority');
    
    todoDiv.appendChild(priority);
    todoDiv.appendChild(createdAt);
    todoDiv.appendChild(todoText);
    
    viewSection.appendChild(todoDiv);
    
    // ----- adding data to each of the divs ----- //
    todoText.innerHTML = textInput;
    priority.innerHTML = document.getElementById('priority-selector').value;
    let date = new Date();
    let timeSQL = date.toLocaleString("SQL");
    createdAt.innerHTML = timeSQL;

    // ----- create an object for each to-do task ------ //
    todoList.push(new toDoTask(priority, todoText, timeSQL));
    console.log(todoList);
    
}   