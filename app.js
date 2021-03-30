// Disable buttons without functions.
document.getElementById("edit-button").disabled = true;
document.getElementById("sort-button").disabled = true;

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
        alert("You must write what you want to do and choose deadline date!")
    } else if (inputValue === "") {
        alert("You must write what you want to do!");
    } else if (dateValue === "") {
        alert("You must choose deadline date!")
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

// Send task-items to Firebase.
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

// Add task-items to lists.
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
   
    // Add "trash can" icon at the end of task.
    const span = document.createElement("span");
    const deleteIcon = document.createElement("img");
    deleteIcon.setAttribute("src", "images/trash-can.png");
    deleteIcon.className = "trash";
    span.className = "close";
    span.appendChild(deleteIcon);
    listItem.appendChild(span);
    
    // Click on a "trush can" icon to delete item from the list. 
    const close = document.getElementsByClassName("close");
    for (i = 0; i < close.length; i++) {
        close[i].onclick = function() {
            let listItem = this.parentElement;
            listItem.style.display = "none"; 
            let key = this.parentElement.id;
            database.ref("my_todos/").child(key).remove();
        }
    }
        
    // Add checkbox at the begining of task.
    const span2 = document.createElement("span");
    const checkbox = document.createElement("INPUT");
    checkbox.setAttribute("type", "checkbox");
    checkbox.className = "checkbox";
    span2.className = "check";
    span2.appendChild(checkbox);
    listItem.appendChild(span2);
    
    // Add "line-through" when checkbox is checked.
    const checkBox = document.getElementsByClassName("checkbox");
    for (i = 0; i < checkBox.length; i++) {
        checkBox[i].onclick = function() {
            let listItem = this.parentElement.parentElement;
            listItem.classList.toggle("checked");
        }
    }   
};

// Delete all tasks from Firebase database.
document.getElementById("delete-all-button").addEventListener("click", () => {
    database.ref("my_todos/").remove();
    document.getElementById("task-list").style.display = "none"; // dziala, ale nie odswieza po dodaniu nowego task-u
});

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

//window.onload(fetchAllData());
window.onload = fetchAllData();
