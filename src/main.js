const addBtn = document.querySelector('#add-button');
const inputElem = document.getElementById('text-input');
const viewSection = document.querySelector('.view-section');
const sortBtn = document.querySelector('#sort-button');
const searchBtn = document.querySelector('#search');
const alertSpan = document.createElement('span'); 
const pageHead = document.querySelector('header');
const shiftMode = document.querySelector('.shiftMode');


let todoList =[];

class toDoTask {
    constructor(priority, text, date, completed){
        this.priority = priority;
        this.text = text;
        this.date = date; 
        this.completed = completed;
    }
}

// ---------------- Event Listeners --------------------- // 

document.addEventListener('DOMContentLoaded',pageInitialize);
addBtn.addEventListener('click', addToDo);
sortBtn.addEventListener('click', sortToDo);
viewSection.addEventListener('click', viewSectionEdit);
searchBtn.addEventListener('click', findText);
alertSpan.addEventListener('click', function(){
    this.parentElement.style.display='none';
});
shiftMode.addEventListener('click', darkMode);

// ---------------- Functions --------------------------- //

function addToDo(event){
    event.preventDefault();
    // ------ check if input is empty ------ //
    
    let textInput = inputElem.value;
    if(textInput === ""){
        alert('must add to-do');
        return false;
    }
    
    // ------ create the divs for each To-Do task ------- //
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo-container');

    const editClick = document.createElement('button')
    editClick.classList.add('editItem');
    editClick.innerHTML = `<i class="fas fa-edit"></i>`;
    const editDiv = document.createElement('div');
    editDiv.classList.add('editDiv');
    editDiv.append(editClick);
    todoDiv.append(editDiv);
    
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
    checkButton.innerHTML = `<i class="fas fa-check-square"></i>`;
    checkButton.classList.add('checkMark');

    const removeButton = document.createElement('button');
    removeButton.innerHTML = `<i class="fas fa-trash"></i>`;
    removeButton.classList.add('removeItem');
    
    todoDiv.append(checkButton);
    todoDiv.append(removeButton);
    
    viewSection.appendChild(todoDiv);

    // ----- adding data to each of the divs ----- //
    todoText.innerText = textInput;
    priority.innerText = document.getElementById('priority-selector').value;
    let date = new Date();
    let timeSQL = date.toISOString().slice(0,19).replace('T',' ');
    createdAt.innerText = timeSQL;
    let completed = false;
    // ----- creating high-priority class ------ //
    if(priority.innerText === '5'){
        priority.classList.add('high-priority');
    }
    // ----- create an object for each to-do task ------ //
    todoList.push(new toDoTask(priority.innerHTML, textInput, timeSQL, completed));
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
        createListItem(todoList, i);
    }
}

function createListItem(myArr, index){
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo-container');

    const editClick = document.createElement('button')
    editClick.classList.add('editItem');
    editClick.innerHTML = `<i class="fas fa-edit"></i>`;
    const editDiv = document.createElement('div');
    editDiv.classList.add('editDiv');
    editDiv.append(editClick);
    todoDiv.append(editDiv);

    const priorityDiv = document.createElement('div');
    priorityDiv.classList.add('todo-priority');
    priorityDiv.append(myArr[index].priority);

    if(myArr[index].priority === '5'){
        priorityDiv.classList.add('high-priority');
    }
    
    const createdAtDiv = document.createElement('div');
    createdAtDiv.classList.add('todo-created-at');
    createdAtDiv.append(myArr[index].date);
    
    const textDiv = document.createElement('div');
    textDiv.classList.add('todo-text');
    textDiv.append(myArr[index].text);
    
    const checkButton = document.createElement('button');
    checkButton.innerHTML = `<i class="fas fa-check-square"></i>`;
    checkButton.classList.add('checkMark');

    if(myArr[index].completed){
        todoDiv.classList.add('completed');
    }

    const removeButton = document.createElement('button');
    removeButton.innerHTML = `<i class="fas fa-trash"></i>`;
    removeButton.classList.add('removeItem');
    
    todoDiv.append(priorityDiv);
    todoDiv.append(createdAtDiv);
    todoDiv.append(textDiv);
    todoDiv.append(checkButton);
    todoDiv.append(removeButton);
    
    viewSection.append(todoDiv);

}

async function updateTodoJson(){
    await fetch("https://api.jsonbin.io/v3/b/601718c40ba5ca5799d1ce31",{method:'put',headers: {'content-type': 'application/json'},body: JSON.stringify(myTodo)});
}

async function getTodoJson(){
    let response = await fetch('https://api.jsonbin.io/v3/b/601718c40ba5ca5799d1ce31/latest');
    let jsonResponse = await response.json(); 
    let myList = jsonResponse["record"];
    return myList['my-todo'];      
}

async function pageInitialize(){
    applyInitialTheme();
    let inputElem = document.getElementById('text-input');
    inputElem.focus();
    let myContent = await getTodoJson();
    for(let i = 0; i < myContent.length; i++){
        createListItem(myContent, i);
        todoList = myContent;
    }
    counter();
}

function counter(){
    let counter = document.querySelector('#counter');
    counter.innerText = todoList.length;
}

function viewSectionEdit(event){
    let temp = event.target;
    if(temp.classList[0] === 'removeItem'){
        removeItem(event);
    }
    else if(temp.classList[0] === 'checkMark'){
        completeTodo(event);
    }
    else if(temp.classList[0] === 'editItem'){
        editItemBox(event);
    }
    else if(temp.classList[0] === 'use-edit'){
        useEdit(event);
        event.target.remove();
    }
}

function removeItem(event){//removes an item from the todo list and the server
    let temp = event.target;
    const todo = temp.parentElement;
    let itemTime = todo.children[2].innerHTML;
    for(let i = 0; i < todoList.length; i++){
        if(todoList[i].date === itemTime){
            todoList.splice(i, 1);
            myTodo = {'my-todo': todoList};
            updateTodoJson();
            event.target.parentElement.remove();
            counter();
        }
    }
}

function completeTodo(event){//toggles between completed & uncompleted, persist through reloads
    let temp = event.target;
    temp.parentElement.classList.toggle('completed');
    const todo = temp.parentElement;
    let itemTime = todo.children[2].innerHTML;
    
    for(let i = 0; i < todoList.length; i++){
        if(todoList[i].date === itemTime){
            todoList[i].completed = !todoList[i].completed;
            myTodo = {'my-todo': todoList};
            updateTodoJson();
        }
    }
}

function editItemBox(event){
    event.preventDefault();
    const editInput = document.createElement('input');
    editInput.classList.add('description-input');
    const editDiv = event.target.parentElement;
    const saveEdit = document.createElement('button');
    saveEdit.classList.add('use-edit');
    saveEdit.innerText = 'Edit';
    editDiv.append(editInput);
    editDiv.append(saveEdit);
}

function useEdit(event){
    event.preventDefault();
    const editInput = event.target.parentElement.children[1];
    const editValue = editInput.value;
    if(editValue === ""){
        alert('no text to edit');
        return;
    }
    let temp = editInput.parentElement.parentElement.children[3].innerText;
    editInput.parentElement.parentElement.children[3].innerText = editValue;
    for(let i=0; i < todoList.length; i++){
        if(todoList[i].text === temp){
            todoList[i].text = editValue;
            myTodo = {'my-todo': todoList};
            updateTodoJson();
            break;
        }
    }
    editInput.remove();
}

function findText(){
    const tempText = document.getElementById('search-for');
    let search = tempText.value;
  
    let counter = 0;
    for(let i = 0; i < todoList.length; i++){
        counter++;
        if(todoList[i].text.includes(search)){
            let temp = todoList[i];
            todoList.splice(i, 1);
            todoList.unshift(temp);
            viewSection.innerHTML = "";
            for(let j=0; j<todoList.length; j++){
                createListItem(todoList, j);
            }
            break;
        }
        else if(counter === todoList.length)//alert for search not found
        {
            const alertDiv = document.createElement('div');
            alertDiv.classList.add('alert');
            alertSpan.classList.add('closeBtn');
            alertSpan.innerText = 'X';
            alertDiv.innerText = 'To-do wasn\'t found.';
            alertDiv.appendChild(alertSpan);
            pageHead.appendChild(alertDiv);
        }   
    }
    tempText.value = "";
    counter = 0; 
}

function darkMode(){
    const htmlTag = document.getElementsByTagName("html")[0]
    if (htmlTag.hasAttribute('data-theme')) {
        htmlTag.removeAttribute('data-theme')
        return window.localStorage.removeItem('site-theme');
    }
    htmlTag.setAttribute("data-theme", "dark");
    window.localStorage.setItem('site-theme', 'dark');
}

function applyInitialTheme () {
    const theme = window.localStorage.getItem('site-theme');
    if (theme !== null) {
        const htmlTag = document.getElementsByTagName('html')[0];
        htmlTag.setAttribute('data-theme', theme);
    }
}

