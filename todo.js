let todo = [];

const list_area = document.querySelector('.list');
const thm = document.querySelector("#thm");
const container = document.querySelector('.container');
const body = document.querySelector('body');

// Retrieving all keys from the browser's local storage
let keyz = Object.keys(localStorage);

//Sorting keys in ascending order, so that the rendered items are displayed
// in the same order that they were added
keyz.sort((a,b) => a - b);

// Each item persisited in local storage is rendered, as is the persisted theme
for (k of keyz) {
    if (k!="theme"){
    const itm = {
        id: Number(k),
        ...JSON.parse(localStorage.getItem(k))
    };

    todo.push(itm);
    renderTodo(itm);
}
else {

    chkbx = document.querySelector('#thm');
    chkbx.checked = true;

    list_area.classList.toggle('dark');
    container.classList.toggle('dark');  
    body.classList.toggle('dark');

}
}

// Function to render items
function renderTodo(todo){
    const list = document.querySelector('.todo-list.js-todo-list');
    const exist = document.querySelector(`[data-key='${todo.id}']`)

   

    // If a todo is deleted, it is removed from the DOM
    if (todo.deleted) {
        exist.remove();
        return;
    }

    // If the item is checked, preparations are made for it to be striked off on the list
    const isChecked = todo.checked?'done':'';
    console.log(isChecked);

    // New list element is created, and the pertinent attributes are set
    const item = document.createElement('li');
    item.setAttribute('class', `todo-item ${isChecked}`);
    item.setAttribute('data-key', todo.id);

    // HTML prepped and appended to/replaced in DOM
    item.innerHTML = ` 
    <label for="${todo.id}" class="tick js-tick">
    <input type="checkbox" id="${todo.id}">
    <span>${todo.text}</span>
    <button class="delete-todo js-delete-todo">
    <i class="fas fa-trash"></i>
    </button>
    </label>
    `;

    if (exist) {
        list.replaceChild(item, exist);
    }
    else {
        list.appendChild(item);
    }
}

// Function to add new list item
function addTodo(txt) {
    const item = {
        text: txt,
        checked: false,
        id: Date.now()
    };

    todo.push(item);
    renderTodo(item)
    console.log(todo);

    // An object containing details of the new item is converted to a string and 
    // is persisted in local storage
    localStorage.setItem(item.id, JSON.stringify({text:txt, checked:false}));
}

let form = document.querySelector('.js-form');

// When a new item is submitted
form.addEventListener("submit", event => {
    event.preventDefault();

    const input = document.querySelector('.js-todo-input');

    const text = input.value.trim();

    // If the text entered is valid, a new todo list item is added, 
    // and the input box, cleared
    if (text != '') {
        addTodo(text);
        input.value = '';
        input.focus();

    }
});

// Function to toggle an item as done/not done
function toggleDone(key) {

    // The ID of the pertinent item is located, and the checked indicator is toggled
    const ind = todo.findIndex(item => item.id === Number(key));
    console.log(ind);
    todo[ind].checked = !todo[ind].checked;
    localStorage.setItem(todo[ind].id, JSON.stringify({text:todo[ind].text, checked:todo[ind].checked}));
    renderTodo(todo[ind]); 
}


// Function to delete the item
function deleteTodo(key) {

    // The ID of the item in question is located, and the deleted indicator is toggled
    const ind = todo.findIndex(item => item.id === Number(key));
    

    const todoo = {
        deleted: true,
        ...todo[ind]
    };

    // The "deleted" item is removed from the list of todos, and is 
    // unpersisited from local storage
    todo = todo.filter(item => item.id !== Number(key));
    localStorage.removeItem(key);
    renderTodo(todoo);
}

const list = document.querySelector('.js-todo-list');

// When an item is clicked, toggle done; all possible elements around the item are 
// checked, to allow the user to click anywhere on the list item
list.addEventListener('click', event => {
    if (event.target.classList.contains('js-tick')) {
        const itmKey = event.target.parentElement.dataset.key;
        toggleDone(itmKey);
        }
    else if (event.target.classList.contains('todo-item')) {
        const itmKey = event.target.dataset.key;
        toggleDone(itmKey);
    }
    else if (event.target.nodeName == 'SPAN') {
        const itmKey = event.target.parentElement.parentElement.dataset.key;
        toggleDone(itmKey);
    }
    else if (event.target.classList.contains('js-delete-todo')) {
        const itmKey = event.target.parentElement.parentElement.dataset.key;
        console.log('del');
        deleteTodo(itmKey);
    }
    
});


// Listening for when the dark mode toggle is clicked on
thm.addEventListener('change', event => {
    
    container.classList.toggle('dark');
    body.classList.toggle('dark');
    list_area.classList.toggle('dark');

    // Persist theme choice in local storage
    if (list_area.classList.contains('dark') ){
        localStorage.setItem("theme", "dark");
}

// Unpersist
else {
    localStorage.removeItem("theme");
}
})


