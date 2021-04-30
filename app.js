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

const database = firebase.database();
const auth = firebase.auth();

// Global variables.
const addTaskButton = document.querySelector("#add-button");
const sortTasksButton = document.querySelector("#sort-button");
const deleteAllTasksButton = document.querySelector("#delete-all-button");

const messageModal = document.getElementById("message-modal");
const spanCloseModal = document.getElementsByClassName("close")[0];
const okButton = document.getElementById("ok-button");
const message = document.getElementById("error-message");

const deleteModal = document.getElementById("delete-message-modal");
const spanCloseDeleteModal = document.getElementsByClassName("close")[1];
const cancelButton = document.getElementById("delete-cancel-button");
const deleteButton = document.getElementById("delete-button");

let sort = false;

// Check if user is signed in.
auth.onAuthStateChanged(function(user) {
    let email, name;
    if (user) {
        // User is signed in.
        email = user.email;
        name = user.displayName;
        document.getElementById("welcome").innerText = "Welcome " + name + "!"
    }
    else {
        // Redirect to login-page.
        email = null;
        window.location.replace("login.html");
    }
});

// Logout user from database.
document.querySelector("#logout-button").addEventListener("click", () => {
    auth.signOut();
});

// Read input when clicking on the "Add new task" button.
const createTask = () => {
    const inputValue = document.getElementById("task-title").value;
    const dateValue = document.getElementById("task-date").value;
    alert(dateValue);
    console.log(dateValue);
    const currentDate = new Date();
    const givenDate = new Date(dateValue);
    currentDate.setHours(0,0,0,0);
    alert(currentDate);
    console.log(currentDate);
    alert(givenDate);
    if (inputValue === "" && dateValue === "") {
        message.innerHTML = "Enter what you want to do and choose deadline date!";
        showMessageModal();
    } else if (inputValue === "") {
        message.innerHTML = "Enter what you want to do!";
        showMessageModal();
    } else if (dateValue === "") {
        message.innerHTML = "Choose deadline date!";
        showMessageModal();
    } else if (givenDate < currentDate) {
        alert("The date must be bigger or equal to current date!");
        console.log("The date must be bigger or equal to current date!");
        message.innerHTML = "The date must be bigger or equal to current date!";
        showMessageModal();
    } else {
        addItemsToDatabase(inputValue, dateValue);
    } 
}

// Setting EventListener for "enter" key.
document.querySelector(".input").addEventListener("keydown", (event) => {
    if (event.keyCode === 13 || event.code === "Enter") {
        event.preventDefault();
        document.querySelector("#add-button").click();
    }
});

// Send task-items to Firebase database.
const addItemsToDatabase = (inputValue, dateValue) => {
    let key = database.ref().child("my_todos/").push().key;
    let description = "Task description";
    let task = {
        title: inputValue,
        date: dateValue,
        description: description,
        timestamp: Date.now(),
        done: false,
        key: key
    };
    
    let updates = {};
    updates["my_todos/" + key] = task;
    database.ref().update(updates);
    
    addItemsToListView(task, key);
};

// Add task-items to list-view.
const addItemsToListView = (task, key) => {
    const listItem = document.createElement("li");
    const taskTitle = document.createElement("p");
    const taskDate = document.createElement("p");
    const timestamp = document.createElement("p");
    const taskInfo = document.createElement("p");  
    
    listItem.id = task.key;
    
    taskTitle.innerHTML = task.title;
    taskTitle.setAttribute("maxlength", "10");
    taskTitle.setAttribute('contenteditable', false);
    
    taskDate.innerHTML = task.date;
    taskDate.className = "date";
    taskDate.setAttribute('contenteditable', false);
    
    timestamp.innerHTML = task.timestamp;
    timestamp.className = "timestamp";
    timestamp.style.display = "none";
    
    taskInfo.innerHTML = task.description;
    taskInfo.className = "description";
    taskInfo.style.display = "none";
    
    done = task.done;   
    
    listItem.innerHTML += taskTitle.outerHTML + taskDate.outerHTML + taskInfo.outerHTML + timestamp.outerHTML;
    
    // Add info-button at the end of task.
    const buttonInfo = document.createElement("button");
    const info = document.createElement("i");
    info.setAttribute('class', 'fas fa-info');
    buttonInfo.setAttribute('id', 'task-info-button');
    buttonInfo.setAttribute('onclick', "checkInfo(this.parentElement, this)");
    buttonInfo.appendChild(info);
    listItem.appendChild(buttonInfo);
    
    // Add checkbox-button at the end of task.
    const buttonCheckbox = document.createElement("button");
    const checkbox = document.createElement("i");
    checkbox.setAttribute('class', 'fas fa-check');
    buttonCheckbox.setAttribute('id', 'task-done-button');
    buttonCheckbox.setAttribute('onclick', "taskChecked(this.parentElement, this)");
    buttonCheckbox.appendChild(checkbox);
    listItem.appendChild(buttonCheckbox);
    
    // Add edit-button at the end of task.
    const buttonEdit = document.createElement("button");  
    const editIcon = document.createElement("i");
    editIcon.setAttribute('class', 'fas fa-pencil-alt');   
    buttonEdit.setAttribute('id', 'task-edit-button');
    buttonEdit.setAttribute('onclick', "taskEdit(this.parentElement, this)");
    buttonEdit.appendChild(editIcon);
    listItem.appendChild(buttonEdit);
    
    // Add delete-button at the end of task.
    const buttonDelete = document.createElement("button");    
    const deleteIcon = document.createElement("i");
    deleteIcon.setAttribute('class', 'fas fa-trash-alt');    
    buttonDelete.setAttribute('id', 'task-delete-button');
    buttonDelete.setAttribute('onclick', "deleteTask(this.parentElement, this)");
    buttonDelete.appendChild(deleteIcon);
    listItem.appendChild(buttonDelete); 
        
    // Check if task is done and set checked-class if it's true.
    if (done === true) {
        listItem.setAttribute("class", "checked");
        buttonCheckbox.firstChild.setAttribute("class", "fas fa-check-double");
        buttonCheckbox.setAttribute("class", "checked");
        buttonEdit.setAttribute("class", "disabled");
        buttonEdit.setAttribute("disabled", "true");
        buttonInfo.setAttribute("class", "disabled");
        buttonInfo.setAttribute("disabled", "true"); 
    }
    
    document.getElementById("task-list").appendChild(listItem);
    document.getElementById("task-title").value = "";
    document.getElementById("task-date").value = "";
    
};

// Toggle sorting tasks due deadline-date and due created-date.
const sortTasks = () => {
    let list, i, switching, listItem, dateValue, shouldSwitch, timestamp;
    if (!sort) {
        list = document.getElementById("task-list");
        switching = true;
        while (switching) {
            switching = false;
            listItem = list.getElementsByTagName("LI");
            for (i = 0; i < (listItem.length - 1); i++) {
                shouldSwitch = false;
                dateValue = list.getElementsByClassName("date");
                if (dateValue[i].innerHTML > dateValue[i + 1].innerHTML) {
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                listItem[i].parentNode.insertBefore(listItem[i + 1], listItem[i]);
                switching = true;
            }
        }
        sort = true;        
    }
    else if (sort) {        
        list = document.getElementById("task-list");
        switching = true;
        while (switching) {
            switching = false;
            listItem = list.getElementsByTagName("LI");
            for (i = 0; i < (listItem.length - 1); i++) {
                shouldSwitch = false;
                timestamp = list.getElementsByClassName("timestamp");
                if (timestamp[i].innerHTML > timestamp[i + 1].innerHTML) {
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                listItem[i].parentNode.insertBefore(listItem[i + 1], listItem[i]);
                switching = true;
            }
        }              
        sort = false;        
    }    
}

// Task description (end edit) when clicked on info-button.
const checkInfo = (listItem, buttonInfo) => {   
    buttonInfo.classList.toggle("checked"); 
    taskInfo = listItem.childNodes[2];
    buttonCheck = listItem.childNodes[5];
    buttonEdit = listItem.childNodes[6];
    
    if (buttonInfo.className === "checked") {
        buttonCheck.setAttribute("class", "disabled");
        buttonCheck.setAttribute("disabled", "true");
        buttonEdit.setAttribute("class", "disabled");
        buttonEdit.setAttribute("disabled", "true");
        taskInfo.style.display = "block";
        taskInfo.setAttribute("contenteditable", true);
        taskInfo.setAttribute("id", "info-editing");
        taskInfo.addEventListener("keydown", (event) => {
            if (event.keyCode === 13 || event.code === "Enter") {
                event.preventDefault();
                taskInfo.setAttribute("contenteditable", false);
                updateTask(listItem);
            }
        });
    } else if (listItem.className !== "checked") {
        buttonCheck.removeAttribute("class", "disabled");
        buttonCheck.removeAttribute("disabled");
        buttonEdit.removeAttribute("class", "disabled");
        buttonEdit.removeAttribute("disabled");
        taskInfo.style.display = "none";
        taskInfo.setAttribute("contenteditable", false);
        taskInfo.setAttribute("id", "no-editing");
        updateTask(listItem);
    }         
};

// Add "line-through" on task and set task to done when checkbox is checked.
const taskChecked = (listItem, buttonCheckbox) => {
    listItem.classList.toggle("checked");
    buttonInfo = listItem.childNodes[4];
    buttonEdit = listItem.childNodes[6];
    
    if (listItem.className === "checked") {
        done = true;
        buttonCheckbox.firstChild.setAttribute("class", "fas fa-check-double");
        buttonCheckbox.setAttribute("class", "checked");
        buttonInfo.setAttribute("class", "disabled");
        buttonInfo.setAttribute("disabled", "true"); 
        buttonEdit.setAttribute("class", "disabled");
        buttonEdit.setAttribute("disabled", "true");           
    } 
    else if (listItem.className !== "checked") {
        done = false;
        buttonCheckbox.firstChild.setAttribute("class", "fas fa-check");
        buttonCheckbox.removeAttribute("class", "checked");
        buttonInfo.removeAttribute("class", "disabled");
        buttonInfo.removeAttribute("disabled"); 
        buttonEdit.removeAttribute("class", "disabled");
        buttonEdit.removeAttribute("disabled");           
    }
    
    updateTask(listItem);
};

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
    
    buttonInfo = listItem.childNodes[4];
    buttonInfo.setAttribute("class", "disabled");
    buttonInfo.setAttribute("disabled", "true");
    
    buttonCheck = listItem.childNodes[5];
    buttonCheck.setAttribute("class", "disabled");
    buttonCheck.setAttribute("disabled", "true");
    
    listItem.addEventListener("keydown", (event) => {
        if (event.keyCode === 13 || event.code === "Enter") {
            event.preventDefault();
            finishEdit(listItem, buttonEdit);
        }
    });
};

// Finish editing task when edit-button clicked again (or enter when editing task).
const finishEdit = (listItem, buttonEdit) => {
    buttonEdit.setAttribute('id', 'task-edit-button');
    buttonEdit.setAttribute("onclick", "taskEdit(this.parentElement, this)");

    taskTitle = listItem.childNodes[0];
    taskTitle.setAttribute("contenteditable", false);
    taskTitle.setAttribute("id", "no-editing");

    taskDate = listItem.childNodes[1];
    taskDate.setAttribute("contenteditable", false);
    taskDate.setAttribute("id", "no-editing");
    
    buttonInfo = listItem.childNodes[4];
    buttonInfo.removeAttribute("class", "disabled");
    buttonInfo.removeAttribute("disabled", "true");
    
    buttonCheck = listItem.childNodes[5];
    buttonCheck.removeAttribute("class", "disabled");
    buttonCheck.removeAttribute("disabled");
    
    updateTask(listItem);
};

// Delete one task from the list when clicked on a "trash can" icon.
const deleteTask = (listItem, buttonDelete) => {
    listItem.style.display = "none";
    let key = listItem.id;
    database.ref("my_todos/").child(key).remove();
};

// Update task and send updated data to Firebase.
const updateTask = (listItem) => {
    let key = listItem.id;
    
    let updatedTask = {
        title: listItem.childNodes[0].innerHTML,
        date: listItem.childNodes[1].innerHTML,
        description: listItem.childNodes[2].innerHTML,
        timestamp: listItem.childNodes[3].innerHTML,
        done: done,
        key: key
    };
    
    let updates = {};
    updates["my_todos/" + key] = updatedTask;
    database.ref().update(updates);
};

// Show modal with error-message.
const showMessageModal = () => {    
    messageModal.style.display = "block";
    okButton.setAttribute("onclick", "hideModal(messageModal)");
    spanCloseModal.setAttribute("onclick", "hideModal(messageModal)");

    window.onclick = function(event) {
        if (event.target === messageModal) {
            hideModal(messageModal);
        }
    }
}

// Show modal with delete-message.
const showDeleteModal = () => {    
    cancelButton.setAttribute("onclick", "hideModal(deleteModal)");
    deleteButton.setAttribute("onclick", "deleteAllTasks()");
    spanCloseDeleteModal.setAttribute("onclick", "hideModal(deleteModal)");
    deleteModal.style.display = "block";
    
    window.onclick = function(event) {
        if (event.target === deleteModal) {
            hideModal(deleteModal);
        }
    }
}

// Delete all tasks from list and hide modal.
const deleteAllTasks = () => {
    database.ref("my_todos/").remove();
    let list = document.getElementById("task-list");
    let listItem = list.getElementsByTagName("LI");

    for (i = 0; i < listItem.length; i++) {
        listItem[i].style.display = "none";
    }   
    hideModal(deleteModal);
}

// Hide modal.
const hideModal = (modal) => {
    modal.style.display = "none";
}

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

// Event listeners to buttons.
addTaskButton.addEventListener("click", createTask);
sortTasksButton.addEventListener("click", sortTasks);
deleteAllTasksButton.addEventListener("click", showDeleteModal);