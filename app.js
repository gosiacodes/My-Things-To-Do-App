// Read input and create a new list item when clicking on the "Add new task" button.
function newTask() {
    var listItem = document.createElement("li");
    var inputValue = document.getElementById("new-task").value;
    var text = document.createTextNode(inputValue);
    listItem.appendChild(text);
    if (inputValue === '') {
        alert("You must write what you want to do!");
    } else {
        document.getElementById("task-list").appendChild(listItem);
    }
    document.getElementById("new-task").value = "";

// Add "trash can" icon at the end of task.
    var span = document.createElement("span");
    var img = document.createElement("img");
    img.setAttribute('src', 'images/trash-can.png');
    img.className = "trash";
    span.className = "close";
    span.appendChild(img);
    listItem.appendChild(span);
    
    for (i = 0; i < close.length; i++) {
        close[i].onclick = function() {
            var div = this.parentElement;
            div.style.display = "none";
        }
    }
}

// Click on a "trush can" icon to delete item from the list.
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
        var div = this.parentElement;
        div.style.display = "none";
    }
}

// Add "checked" sign and "line-through" when clicking on a list item.
document.querySelector("ul").addEventListener("click",(event)  => {
    if (event.target.tagName === "LI") {
        event.target.classList.toggle("checked");
    }
});

// Setting EventListener for "enter" key.
document.querySelector(".input").addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.querySelector(".add-icon").click();
    }
});

