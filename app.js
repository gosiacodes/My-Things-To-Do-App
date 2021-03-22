// Read input and create a new list item when clicking on the "Add new task" button.
document.getElementById("add-button").addEventListener("click", () => {
    const listItem = document.createElement("li");
    const inputValue = document.getElementById("new-task").value;
    const text = document.createTextNode(inputValue);
    listItem.appendChild(text);
    if (inputValue === '') {
        alert("You must write what you want to do!");
    } else {
        document.getElementById("task-list").appendChild(listItem);
    }
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
});

// Click on a "trush can" icon to delete item from the list.
const close = document.getElementsByClassName("close");
let i;
for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
        let div = this.parentElement;
        div.style.display = "none";
    }
}

// Add "checked" sign and "line-through" when clicking on a list item.
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


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

let database = firebase.database();