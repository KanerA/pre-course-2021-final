// ---------------- globally used variables ------------------//
const addBtn = document.querySelector('#add-button');
const inputElem = document.getElementById('text-input');
const viewSection = document.querySelector('.view-section');
const sortBtn = document.querySelector('#sort-button');
const searchBtn = document.querySelector('#search-button');
const alertSpan = document.createElement('span'); 
const pageHead = document.querySelector('header');
const shiftMode = document.getElementById('mode-button');
const spinner = document.getElementById("spinner");

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
    
    // ------ create the divs for each To-Do task ------- // used when adding a list item
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo-container');

    const editClick = document.createElement('button');
    editClick.classList.add('editItem');
    editClick.innerHTML = `<i class="fas fa-edit"></i>`;
    const editDiv = document.createElement('div');
    editDiv.classList.add('editDiv');
    
    const priority = document.createElement('div');
    priority.classList.add('todo-priority');
    
    const createdAt = document.createElement('div');
    createdAt.classList.add('todo-created-at');
    
    const todoText = document.createElement('div');
    todoText.classList.add('todo-text');
    
    const checkButton = document.createElement('button');
    checkButton.innerHTML = `<i class="fas fa-check-square"></i>`;
    checkButton.classList.add('checkMark');
    
    const removeButton = document.createElement('button');
    removeButton.innerHTML = `<i class="fas fa-trash"></i>`;
    removeButton.classList.add('removeItem');
    
    editDiv.append(editClick);
    todoDiv.append(editDiv);
    todoDiv.appendChild(priority);
    todoDiv.appendChild(createdAt);
    todoDiv.appendChild(todoText); 
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
// -------- sorting function ---------- //
function sortToDo(){
    todoList.sort(function(a, b){
        return b.priority - a.priority;
    });
    
    viewSection.innerHTML = "";
    for(let i=0; i < todoList.length; i++){
        createListItem(todoList, i);
    }
}

function createListItem(myArr, index){// creating the to-do's on screen after sort, GET, search
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo-container');

    const editClick = document.createElement('button')
    editClick.classList.add('editItem');
    editClick.innerHTML = `<i class="fas fa-edit"></i>`;
    const editDiv = document.createElement('div');
    editDiv.classList.add('editDiv');
    
    const priority = document.createElement('div');
    priority.classList.add('todo-priority');
    priority.append(myArr[index].priority);
    
    if(myArr[index].priority === '5'){
        priority.classList.add('high-priority');
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
    
    editDiv.append(editClick);
    todoDiv.append(editDiv);
    todoDiv.appendChild(priority);
    todoDiv.appendChild(createdAtDiv);
    todoDiv.appendChild(textDiv);
    todoDiv.append(checkButton);
    todoDiv.append(removeButton);
    
    viewSection.append(todoDiv);

}

async function updateTodoJson(){      // upsates data to jsonbin
    await fetch("https://api.jsonbin.io/v3/b/601890efdde2a87f921c4043",{method:'put',headers: {'content-type': 'application/json'},body: JSON.stringify(myTodo)});
}

async function getTodoJson(){     //gets data from jsonbin
    let response = await fetch('https://api.jsonbin.io/v3/b/601890efdde2a87f921c4043/latest');
    let jsonResponse = await response.json(); 
    let myList = jsonResponse["record"];
    return myList["my-todo"];      
}

async function pageInitialize(){// initializing the page, with the theme, GET from the JSONBin, and creating the list
    applyInitialTheme();
    let inputElem = document.getElementById('text-input');
    inputElem.focus();
    showSpinner();
    let myContent = await getTodoJson();
    hideSpinner();
    for(let i = 0; i < myContent.length; i++){
        createListItem(myContent, i);
        todoList = myContent;
    }
    counter();
}

function applyInitialTheme () {// applying the light/dark mode, depending on what was used last
    const theme = window.localStorage.getItem('site-theme');
    if (theme !== null) {
        const htmlTag = document.getElementsByTagName('html')[0];
        htmlTag.setAttribute('data-theme', theme);
        if(theme === 'dark'){    //making the mode button to match the starter theme (light/dark)
            shiftMode.innerText = 'Dark';
        }
        else{
            shiftMode.innerText = 'Light';
        }
    }
}

function counter(){
    let counter = document.querySelector('#counter');
    counter.innerText = todoList.length;
}

function viewSectionEdit(event){// controls the click events on the to-do tasks
    let temp = event.target;
    switch (temp.classList[0]) {
        case 'removeItem':
            removeItem(event);
            break;
        case 'checkMark':
            completeTodo(event);
            break;
        case 'editItem':
            editItemBox(event);
            break;
        case 'use-edit':
            if(useEdit(event)){          //checking if the edit input box was empty
                event.target.remove();   // if it wasnt and text is updated, deletes the edit button
            }
            break;
        default:
            break;
    }
}

function removeItem(event){                     //removes an item from the todo list and the server
    let temp = event.target;
    const todo = temp.parentElement;
    let itemTime = todo.children[2].innerText;
    for(let i = 0; i < todoList.length; i++){
        if(todoList[i].date === itemTime){
            todoList.splice(i, 1);
            myTodo = {'my-todo': todoList};
            updateTodoJson();
            todo.remove();
            counter();
        }
    }
}

function completeTodo(event){                   //toggles between completed & uncompleted, persist through reloads
    let temp = event.target;
    temp.parentElement.classList.toggle('completed');
    const todo = temp.parentElement;
    let itemTime = todo.children[2].innerHTML;
    for(let i = 0; i < todoList.length; i++){
        if(todoList[i].date === itemTime){
            todoList[i].completed = !todoList[i].completed;
            myTodo = {'my-todo': todoList};
            updateTodoJson();
            if(todoList[i].completed){
                createListItem(todoList, i);
                event.target.parentElement.remove();
            }
        }
    }
}

function editItemBox(event){
    event.preventDefault();
    const editInput = document.createElement('input');
    editInput.classList.add('edit-input');
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
        return false;
    }
    let temp = editInput.parentElement.parentElement.children[3].innerText;// takes the text value from the div that is edited
    editInput.parentElement.parentElement.children[3].innerText = editValue;// puts the new value we entered at the input box
    for(let i=0; i < todoList.length; i++){
        if(todoList[i].text === temp){
            todoList[i].text = editValue;
            myTodo = {'my-todo': todoList};             //updating the json format with the new list after changing the text
            updateTodoJson();
            break;
        }
    }
    editInput.remove();//removing the edit input box
    return true;
}

function findText(){
    const tempText = document.getElementById('search-for');
    let search = tempText.value;
    let counter = 0;
    for(let i = 0; i < todoList.length; i++){
        counter++;
        if(todoList[i].text.includes(search) && search !== ""){
            let temp = todoList[i];
            todoList.splice(i, 1);
            todoList.unshift(temp);
            viewSection.innerHTML = "";
            for(let j=0; j<todoList.length; j++){
                createListItem(todoList, j);
            }
            console.log(todoList.length);
            console.log(counter);
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
        htmlTag.removeAttribute('data-theme');
        shiftMode.innerText = 'Light';
        return window.localStorage.removeItem('site-theme');
    }
    htmlTag.setAttribute("data-theme", "dark");
    window.localStorage.setItem('site-theme', 'dark');
    shiftMode.innerText = 'Dark';
}

function showSpinner() {
    spinner.className = "show";
    setTimeout(() => {
      spinner.className = spinner.className.replace("show", "");
    }, 5000);
  }
  
function hideSpinner() {
    spinner.className = spinner.className.replace("show", "");
}