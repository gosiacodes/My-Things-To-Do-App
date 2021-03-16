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

}