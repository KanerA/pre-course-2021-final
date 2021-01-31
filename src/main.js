const addBtn = document.querySelector('#add-button');
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

document.addEventListener('DOMContentLoaded',async () => {
    let inputElem = document.getElementById('text-input');
    inputElem.focus();
    let myContent = await getTodoJson();
    for(let i = 0; i < myContent.length; i++){
        createListItem(myContent, i);
        todoList = myContent;
        counter();
    }
});
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
    let inputElem = document.getElementById('text-input');
    let textInput = inputElem.value;
    if(textInput === ""){
        alert('must add to-do');
        return false;
    }
    
    // ------ create the divs for each To-Do task ------- //
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo-container');

    const descriptionButton = document.createElement('button');
    descriptionButton.innerHTML = `<i class="fas fa-plus"></i>`;
    descriptionButton.classList.add('descriptionBtn');
    todoDiv.append(descriptionButton);
    
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
    todoText.innerHTML = textInput;
    priority.innerHTML = document.getElementById('priority-selector').value;
    let date = new Date();
    let timeSQL = date.toISOString().slice(0,19).replace('T',' ');
    createdAt.innerHTML = timeSQL;
    let completed = false;
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

    const descriptionButton = document.createElement('button');
    descriptionButton.innerHTML = `<i class="fas fa-plus"></i>`;
    descriptionButton.classList.add('descriptionBtn');
    todoDiv.append(descriptionButton);

    let priorityDiv = document.createElement('div');
    priorityDiv.classList.add('todo-priority');
    priorityDiv.append(myArr[index].priority);
    
    let createdAtDiv = document.createElement('div');
    createdAtDiv.classList.add('todo-created-at');
    createdAtDiv.append(myArr[index].date);
    
    let textDiv = document.createElement('div');
    textDiv.classList.add('todo-text');
    textDiv.append(myArr[index].text);
    
    let checkButton = document.createElement('button');
    checkButton.innerHTML = `<i class="fas fa-check-square"></i>`;
    checkButton.classList.add('checkMark');

    if(myArr[index].completed){
        todoDiv.classList.add('completed');
    }

    let removeButton = document.createElement('button');
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

function viewSectionEdit(event){
    let temp = event.target;
    if(temp.classList[0] === 'removeItem'){
        removeItem(event);
    }
    else if(temp.classList[0] === 'checkMark'){
        completeTodo(event);
    }
    else if(temp.classList[0] === 'descriptionBtn'){
        addDescription(event);
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

function findText(){
    let tempText = document.getElementById('search-for');
    const search = tempText.value;
  
    let counter = 0;
    for(let i = 0; i < todoList.length; i++){
        counter++;
        
        if(todoList[i].text === search){
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
    counter = 0; 
}

function darkMode(){
    // let body = document.body;
    // body.classList.toggle('darkMode');
    const htmlTag = document.getElementsByTagName("html")[0]
    if (htmlTag.hasAttribute("data-theme")) {
        htmlTag.removeAttribute("data-theme")
        return;
    }

    htmlTag.setAttribute("data-theme", "dark")

}


