const addBtn = document.querySelector('#add-button');
const viewSection = document.querySelector('.view-section');
const sortBtn = document.querySelector('#sort-button');

let todoList =[];

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
    for(let i = 0; i < myContent.length; i++){
        createListItem(myContent, i);
        todoList = myContent;
        counter();
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

    const checkButton = document.createElement('button');
    checkButton.innerHTML = `<i class="fas fa-check"></i>`
    checkButton.classList.add('checkMark');
    checkButton.appendChild(checkSign);

    const removeButton = document.createElement('button');
    removeButton.innerHTML = `<i class="fas fa-trash"></i>`
    removeButton.classList.add('removeItem');
    removeButton.appendChild(removeSign);

    todoDiv.append(checkButton);
    todoDiv.append(removeButton);
    
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
    counter();
    
    // ----- clear input field and focus for next input --- //
    inputElem.value = "";
    inputElem.focus();
    
    // ----- updating the JSONbin.io ----- //
    myTodo = {'my-todo': todoList};
    updateTodoJson();
}

function sortToDo(){
    todoList.sort(function(a, b){
        return b.priority - a.priority;
    });
    
    viewSection.innerHTML = "";
    for(let i=0; i < todoList.length; i++){
        createListItem(todoList,i);
    }
}

function createListItem(myArr, index){
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo-container');
        priorityDiv = document.createElement('div');
        priorityDiv.classList.add('todo-priority');
        priorityDiv.append(myArr[index].priority);
        
        createdAtDiv = document.createElement('div');
        createdAtDiv.classList.add('todo-created-at');
        createdAtDiv.append(myArr[index].date);
        
        textDiv = document.createElement('div');
        textDiv.classList.add('todo-text');
        textDiv.append(myArr[index].text);

        checkButton = document.createElement('button');
        checkButton.classList.add('checkMark');
        checkSign = document.createElement('i');
        checkSign.classList.add('fas', 'fa-check-square');
        checkButton.appendChild(checkSign);

        removeButton = document.createElement('button');
        removeButton.classList.add('removeItem');
        removeSign = document.createElement('i');
        removeSign.classList.add('fas', 'fa-trash');
        removeButton.appendChild(removeSign);
        
        todoDiv.append(priorityDiv);
        todoDiv.append(createdAtDiv);
        todoDiv.append(textDiv);
        todoDiv.append(checkButton);
        todoDiv.append(removeButton);
        
        viewSection.append(todoDiv);
}

async function updateTodoJson(){
    await fetch("https://api.jsonbin.io/v3/b/6012eb097bfaff74c39959f7",{method:'put',headers: {'content-type': 'application/json'},body: JSON.stringify(myTodo)});
}

async function getTodoJson(){
    let response = await fetch('https://api.jsonbin.io/v3/b/6012eb097bfaff74c39959f7/latest');
    let jsonResponse = await response.json(); 
    let recordResponse = jsonResponse["record"];
    let myList = recordResponse; 
    return myList['my-todo'];      
}

function counter(){
    let counter = document.querySelector('#counter');
    counter.innerHTML = todoList.length;
}