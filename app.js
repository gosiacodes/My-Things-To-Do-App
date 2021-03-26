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

// Testing Firebase - will be deleted soon. 
var bigOne = document.getElementById("bigOne");
var dbRef = firebase.database().ref().child("text");
dbRef.on("value", snap => bigOne.innerText = snap.val());

// Read input when clicking on the "Add new task" button.
document.getElementById("add-button").addEventListener("click", () => {
    const inputValue = document.getElementById("new-task").value;   
    if (inputValue === '') {
        alert("You must write what you want to do!");
    } else {
        addItemsToList(inputValue);
    } 
});

// Add items to list and send data to Firebase database.
const addItemsToList = (inputValue) => {
    const listItem = document.createElement("li");
    let key = database.ref().child("my_todos/").push().key;
    let task = {
            title: inputValue,
            done: false,
            key: key
        };
    
    let updates = {};
    updates["my_todos/" + key] = task;
    firebase.database().ref().update(updates);
      
    listItem.id = task.key;
    listItem.innerHTML = task.title;

    document.getElementById("task-list").appendChild(listItem);
    document.getElementById("new-task").value = "";
   
    // Add "trash can" icon at the end of task.
    const span = document.createElement("span");
    const deleteIcon = document.createElement("img");
    deleteIcon.setAttribute('src', 'images/trash-can.png');
    deleteIcon.className = "trash";
    span.className = "close";
    span.appendChild(deleteIcon);
    listItem.appendChild(span);
    
    for (i = 0; i < close.length; i++) {
        close[i].onclick = function() {
            var div = this.parentElement;
            div.style.display = "none";
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
};


// Click on a "trush can" icon to delete item from the list.
const close = document.getElementsByClassName("close");
let i;
for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
        let listItem = this.parentElement;             
        key = listItem.id;  
        database.ref("my_todos/").child(key).remove();
        listItem.style.display = "none"; 
        
        //database.ref("my_todos/" + key).remove();
        //database.ref("my_todos/").child(key).remove();
        //database.ref().child("my_todos/").remove().key;
    }
}

// Add "line-through" when clicking on a list item.
document.querySelector(".list").addEventListener("click",(event)  => {
    if (event.target.tagName === "LI") {
        event.target.classList.toggle("checked");     
    }
});

// Setting EventListener for "enter" key.
document.querySelector(".input").addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.querySelector("#add-button").click();
    }
});

// Delete all tasks from Firebase database.
document.getElementById("delete-all-button").addEventListener("click", () => {
    database.ref("my_todos/").remove();
});

// Fetch all data with Firebase database.
function fetchAllData(){
    database.ref("my_todos/").once("value", function(snapshot){
        snapshot.forEach(function(ChildSnapshot){
            let task = ChildSnapshot.val();
            let key = ChildSnapshot.val().key;
            
            const listItem = document.createElement("li");
            
            listItem.id = task.key;      
            listItem.innerHTML = task.title;

            document.getElementById("task-list").appendChild(listItem);
            document.getElementById("new-task").value = "";

            // Add "trash can" icon at the end of task.
            const span = document.createElement("span");
            const deleteIcon = document.createElement("img");
            deleteIcon.setAttribute('src', 'images/trash-can.png');
            deleteIcon.className = "trash";
            span.className = "close";
            span.appendChild(deleteIcon);
            listItem.appendChild(span);

            for (i = 0; i < close.length; i++) {
                close[i].onclick = function() {
                    var div = this.parentElement;
                    div.style.display = "none";
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
            });           
    });   
}

window.onload(fetchAllData());

