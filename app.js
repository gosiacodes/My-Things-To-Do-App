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

// Add "X" at the end of task.
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