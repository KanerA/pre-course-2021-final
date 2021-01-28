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
document.addEventListener('DOMContentLoaded',async () => {
    let myContent = await getTodoJson();
    console.log(myContent);
    for(let i = 0; i < myContent.length; i++){
        createListItem(i);
    }
});

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
    todoList.push(new toDoTask(priority.innerHTML, textInput, timeSQL));

    // ------ adding counter of to-do's ------- //
    let arrCounter = todoList.length;
    let counter = document.querySelector('#counter');
    counter.innerHTML = arrCounter + " To-Do's";
    
    // ----- clear input field and focus for next input --- //
    inputElem.value = "";
    inputElem.focus();

    myTodo = {'myTodo': todoList};
    updateTodoJson();
}

function sortToDo(){
    todoList.sort(function(a, b){
        return b.priority - a.priority;
    });
    
    viewSection.innerHTML = "";
    for(let i=0; i < todoList.length; i++){
        createListItem(i);
    }
}

function createListItem(index){
    if(todoList === []){

        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo-container');
        console.log(todoList);
        priorityDiv = document.createElement('div');
        priorityDiv.classList.add('todo-priority');
        priorityDiv.append(todoList[index].priority);
        
        createdAtDiv = document.createElement('div');
        createdAtDiv.classList.add('todo-created-at');
        createdAtDiv.append(todoList[index].date);
        
        textDiv = document.createElement('div');
        textDiv.classList.add('todo-text');
        textDiv.append(todoList[index].text);
        
        todoDiv.append(priorityDiv);
        todoDiv.append(createdAtDiv);
        todoDiv.append(textDiv);
        
        viewSection.append(todoDiv);
    }
}

async function updateTodoJson(){
    await fetch("https://api.jsonbin.io/v3/b/6012eb097bfaff74c39959f7",{method:'put',headers: {'content-type': 'application/json'},body: JSON.stringify(myTodo)});
}

async function getTodoJson(){
    let response = await fetch('https://api.jsonbin.io/v3/b/6012eb097bfaff74c39959f7/latest');
    let jsonResponse = await response.json(); 
    let recordResponse = jsonResponse["record"];
    let myList = recordResponse; 
    return myList.myTodo;      
}
