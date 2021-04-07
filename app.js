// Web app's Firebase configuration.
var firebaseConfig = {
    apiKey: "AIzaSyB5kRc09ifanS9_tXPoOAPh2OYcYGZibM8",
    authDomain: "my-things-to-do.firebaseapp.com",
    databaseURL: "https://my-things-to-do-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "my-things-to-do",
    storageBucket: "my-things-to-do.appspot.com",
    messagingSenderId: "701583012637",
    appId: "1:701583012637:web:091b338bd38e88f345a7f4",
    measurementId: "G-TE1EGL3L0M"
};
// Initialize Firebase.
firebase.initializeApp(firebaseConfig);
firebase.analytics();

let database = firebase.database();

// Read input when clicking on the "Add new task" button.
document.getElementById("add-button").addEventListener("click", () => {
    const inputValue = document.getElementById("task-title").value;
    const dateValue = document.getElementById("task-date").value;
    //const currentDate = new Date();
    //const givenDate = new Date(dateValue);
    if (inputValue === "" && dateValue === "") {
        alert("You must write what you want to do and choose deadline date!");
    } else if (inputValue === "") {
        alert("You must write what you want to do!");
    } else if (dateValue === "") {
        alert("You must choose deadline date!");
    //} else if (givenDate < currentDate) {
    //    alert("The date must be bigger or equal to current date!")
    } else {
        addItemsToDatabase(inputValue, dateValue);
    } 
});

// Setting EventListener for "enter" key.
document.querySelector(".input").addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.querySelector("#add-button").click();
    }
});

// Send task-items to Firebase database.
const addItemsToDatabase = (inputValue, dateValue) => {
    let key = database.ref().child("my_todos/").push().key;
    let task = {
        title: inputValue,
        date: dateValue,
        done: false,
        key: key
    };
    
    let updates = {};
    updates["my_todos/" + key] = task;
    firebase.database().ref().update(updates);
    
    addItemsToListView(task, key);
};

// Add task-items to list-view.
const addItemsToListView = (task, key) => {
    const listItem = document.createElement("li");
    const taskTitle = document.createElement("p");
    const taskDate = document.createElement("p");
    
    taskDate.className = "date";
    listItem.id = task.key;
    taskTitle.innerHTML = task.title;
    taskDate.innerHTML = task.date;
    
    listItem.innerHTML += taskTitle.outerHTML + taskDate.outerHTML;

    document.getElementById("task-list").appendChild(listItem);
    document.getElementById("task-title").value = "";
    document.getElementById("task-date").value = "";
    
    // Add delete-button at the end of task.
    const buttonDelete = document.createElement("button");    
    const deleteIcon = document.createElement("i");
    deleteIcon.setAttribute('class', 'fas fa-trash-alt');    
    buttonDelete.setAttribute('id', 'task-delete-button');
    buttonDelete.setAttribute('class', 'close');
    buttonDelete.appendChild(deleteIcon);
    listItem.appendChild(buttonDelete); 
    
    // Add edit-button at the end of task.
    const buttonEdit = document.createElement("button");  
    const editIcon = document.createElement("i");
    editIcon.setAttribute('class', 'fas fa-pencil-alt');   
    buttonEdit.setAttribute('id', 'task-edit-button');
    buttonEdit.setAttribute('onclick', "taskEdit(this.parentElement, this)");
    buttonEdit.appendChild(editIcon);
    listItem.appendChild(buttonEdit);
    
    // Add checkbox-button at the end of task.
    const buttonCheckbox = document.createElement("button");
    const checkbox = document.createElement("i");
    checkbox.setAttribute('class', 'fas fa-check');
    buttonCheckbox.setAttribute('id', 'task-done-button');
    buttonCheckbox.setAttribute('class', 'check');
    buttonCheckbox.appendChild(checkbox);
    listItem.appendChild(buttonCheckbox);
    
    // Delete item from the list when clicked on a "trash can" icon.
    const close = document.getElementsByClassName("close");
    for (i = 0; i < close.length; i++) {
        close[i].onclick = function() {
            let listItem = this.parentElement;
            listItem.style.display = "none"; 
            let key = this.parentElement.id;
            database.ref("my_todos/").child(key).remove();
        }
    }
    
    // Add "line-through" on task when checkbox is checked.
    const checkBox = document.getElementsByClassName("check");
    for (i = 0; i < checkBox.length; i++) {
        checkBox[i].onclick = function() {
            let listItem = this.parentElement;
            listItem.classList.toggle("checked");
            this.firstChild.classList.toggle("fa-check-double");
        }
    }
    /*
    // Description???
    document.querySelector(".list").addEventListener("click",(event)  => {
        if (event.target.tagName === "LI") {
            alert("Here will come the description");  
        }
    });
    */
};

// Sort tasks by deadline-date.
document.getElementById("sort-button").addEventListener("click", () => {
    let list, i, switching, listItem, dateValue, shouldSwitch;
    list = document.getElementById("task-list");
    switching = true;
    while (switching) {
        switching = false;
        listItem = list.getElementsByTagName("LI");
        for (i = 0; i < (listItem.length - 1); i++) {
            shouldSwitch = false;
            dateValue = list.getElementsByClassName("date");
            if (dateValue[i].innerHTML.toLowerCase() > dateValue[i + 1].innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
            }
        }
        if (shouldSwitch) {
            listItem[i].parentNode.insertBefore(listItem[i + 1], listItem[i]);
            switching = true;
        }
    }
});

// Delete all tasks from list-view and from Firebase database.
document.getElementById("delete-all-button").addEventListener("click", () => {
    database.ref("my_todos/").remove();
    let list = document.getElementById("task-list");
    let listItem = list.getElementsByTagName("LI");
    for (i = 0; i < listItem.length; i++) {
        listItem[i].style.display = "none";
    }
});

// Edit task when edit-button clicked.
const taskEdit = (listItem, buttonEdit) => {
        buttonEdit.setAttribute("id", "task-edit-button-editing");
        buttonEdit.setAttribute("onclick", "finishEdit(this.parentElement, this)");
        
        taskTitle = listItem.childNodes[0];
        taskTitle.setAttribute("contenteditable", true);
        taskTitle.setAttribute("id", "title-editing");
        taskTitle.focus();
        
        taskDate = listItem.childNodes[1];
        taskDate.setAttribute("contenteditable", true);
        taskDate.setAttribute("id", "date-editing");
};

// Finish editing task when edit-button clicked again.
const finishEdit = (listItem, buttonEdit) => {
        buttonEdit.setAttribute('id', 'task-edit-button');
        buttonEdit.setAttribute("onclick", "taskEdit(this.parentElement, this)");

        taskTitle = listItem.childNodes[0];
        taskTitle.setAttribute("contenteditable", false);
        taskTitle.setAttribute("id", "no-editing");
        
        taskDate = listItem.childNodes[1];
        taskDate.setAttribute("contenteditable", false);
        taskDate.setAttribute("id", "no-editing");
};

// Fetch all data with Firebase database.
function fetchAllData(){   
    database.ref("my_todos/").once("value", function(snapshot){
        snapshot.forEach(function(ChildSnapshot){
            let task = ChildSnapshot.val();
            let key = ChildSnapshot.val().key;
            addItemsToListView(task, key);
        });           
    });   
}

window.onload = fetchAllData();
