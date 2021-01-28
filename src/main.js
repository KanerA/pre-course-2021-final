const addBtn = document.querySelector('#add-button');
const viewSection = document.querySelector('.view-section');
const sortBtn = document.querySelector('#sort-button');

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
sortBtn.addEventListener('click', sortToDo);

// ---------------- Functions --------------------------- //

function addToDo(event){
    event.preventDefault();
    // ------ check if input is empty ------ //
    let inputElem = document.getElementById('text-input');
    let textInput = inputElem.value;
    if(textInput === ""){
        alert('must add to-do');
        return false;
    }
    
    // ------ create the divs for each To-Do task ------- //
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo-container');
    
    const priority = document.createElement('div');
    priority.classList.add('todo-priority');
    todoDiv.appendChild(priority);
    
    const createdAt = document.createElement('div');
    createdAt.classList.add('todo-created-at');
    todoDiv.appendChild(createdAt);
    
    const todoText = document.createElement('div');
    todoText.classList.add('todo-text');
    todoDiv.appendChild(todoText);
    
    
    viewSection.appendChild(todoDiv);

    // ----- adding data to each of the divs ----- //
    todoText.innerHTML = textInput;
    priority.innerHTML = document.getElementById('priority-selector').value;
    let date = new Date();
    let timeSQL = date.toISOString().slice(0,19).replace('T',' ');
    createdAt.innerHTML = timeSQL;
    
    // ----- create an object for each to-do task ------ //
    todoList.push(new toDoTask(priority, todoText, timeSQL));
    
    // ------ adding counter of to-do's ------- //
    let arrCounter = todoList.length;
    let counter = document.querySelector('#counter');
    counter.innerHTML = arrCounter + " To-Do's";
    
    // ----- clear input field and focus for next input --- //
    inputElem.value = "";
    inputElem.focus();
}


function sortToDo(){
    todoList.sort(function(a, b){
        return a.priority.innerHTML - b.priority.innerHTML;
    });

    viewSection.innerHTML = "";
    for(let i=0; i < todoList.length; i++){
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo-container');
        todoDiv.append(todoList[i].priority);
        todoDiv.append(todoList[i].date);
        todoDiv.append(todoList[i].text);
        viewSection.append(todoDiv);
    }
}