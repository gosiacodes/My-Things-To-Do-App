// Web app's Firebase configuration.
var firebaseConfig = {
  apiKey: "AIzaSyB5kRc09ifanS9_tXPoOAPh2OYcYGZibM8",
  authDomain: "my-things-to-do.firebaseapp.com",
  databaseURL:
    "https://my-things-to-do-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "my-things-to-do",
  storageBucket: "my-things-to-do.appspot.com",
  messagingSenderId: "701583012637",
  appId: "1:701583012637:web:091b338bd38e88f345a7f4",
  measurementId: "G-TE1EGL3L0M",
};

// Initialize Firebase.
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const auth = firebase.auth();

// Global variables.

// Main buttons variables.
const addTaskButton = document.querySelector("#add-button");
const sortTasksButton = document.querySelector("#sort-button");
const deleteAllTasksButton = document.querySelector("#delete-all-button");
const userProfileButton = document.querySelector("#user-button");
const logoutButton = document.querySelector("#logout-button");
const enterTask = document.querySelector("#task-title");

// Error modal variables.
const messageModal = document.querySelector("#message-modal");
const closeMessageModal = document.querySelector("#error-close");
const okButton = document.querySelector("#ok-button");
const message = document.querySelector("#error-message");

// User update profile modal variables.
const userModal = document.querySelector("#user-profile-modal");
const closeUserModal = document.querySelector("#user-close");
const updateEmailButton = document.querySelector("#update-email-button");
const updatePasswordButton = document.querySelector("#update-password-button");
const updateNameButton = document.querySelector("#update-name-button");
const deleteUserButton = document.querySelector("#delete-user-button");
const resetButton = document.querySelector("#update-reset-button");
const closeUpdateButton = document.querySelector("#update-close-button");

// Delete user modal variables.
const deleteUserModal = document.querySelector("#delete-user-modal");
const closeDeleteUserModal = document.querySelector("#delete-user-close");
const deleteUserCancelButton = document.querySelector(
  "#delete-user-cancel-button"
);
const deleteUserConfirmButton = document.querySelector(
  "#delete-user-confirm-button"
);

// Delete all tasks modal variables.
const deleteTasksModal = document.querySelector("#delete-tasks-modal");
const closeDeleteTasksModal = document.querySelector("#delete-close");
const deleteTasksCancelButton = document.querySelector("#delete-cancel-button");
const deleteTasksButton = document.querySelector("#delete-tasks-button");

let sort = false;

// Check if user is signed in.
auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    let email, displayName;
    userId = user.uid;
    email = user.email;
    displayName = user.displayName;
    document.querySelector("#welcome").innerText =
      "Welcome " + displayName + "!";
    writeUserData(displayName, email);
    fetchAllData();
  } else {
    // Redirect to login-page.
    email = null;
    window.location.replace("login.html");
  }
});

// Save user data in database.
const writeUserData = (displayName, email) => {
  database.ref("users/" + userId).set({
    displayName: displayName,
    email: email,
  });
  getUserData();
};

// Get user data from database.
const getUserData = () => {
  database.ref("users/" + userId).on("value", (snapshot) => {
    let data = snapshot.val();
    let email = data.email;
    console.log("snapshot email: " + email);
    let displayName = data.displayName;
    console.log("snapshot displayName: " + displayName);
  });
};

// Fetch all data with Firebase database.
const fetchAllData = () => {
  database.ref(userId + "/todos/").once("value", function (snapshot) {
    snapshot.forEach(function (ChildSnapshot) {
      let task = ChildSnapshot.val();
      let key = task.key;
      addItemsToListView(task, key);
    });
  });
};

// Logout user from database.
const signOut = () => {
  auth.signOut();
};

// EventListener for "enter" key used when adding new task.
const enterTaskEvent = (event) => {
  if (event.keyCode === 13 || event.code === "Enter") {
    event.preventDefault();
    document.querySelector("#add-button").click();
  }
};

// Read input when clicking on the "Add new task" button.
const createTask = () => {
  const inputValue = document.querySelector("#task-title").value;
  const dateValue = document.querySelector("#task-date").value;
  const currentDate = new Date();
  const givenDate = new Date(dateValue);
  currentDate.setHours(0, 0, 0, 0);
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
    message.innerHTML = "The date must be bigger or equal to current date!";
    showMessageModal();
  } else {
    addItemsToDatabase(inputValue, dateValue);
  }
};

// Send task-items to Firebase database.
const addItemsToDatabase = (inputValue, dateValue) => {
  let key = database
    .ref()
    .child(userId + "/todos/")
    .push().key;
  let description = "Task description";
  let task = {
    title: inputValue,
    date: dateValue,
    description: description,
    timestamp: Date.now(),
    done: false,
    key: key,
  };

  let updates = {};
  updates[userId + "/todos/" + key] = task;
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
  const taskButtons = document.createElement("div");

  const taskData = document.createElement("div");
  taskData.className = "task-data";

  listItem.id = task.key;

  taskTitle.innerHTML = task.title;
  taskTitle.setAttribute("maxlength", "10");
  taskTitle.setAttribute("contenteditable", false);

  taskDate.innerHTML = task.date;
  taskDate.className = "date";
  taskDate.setAttribute("contenteditable", false);

  timestamp.innerHTML = task.timestamp;
  timestamp.className = "timestamp";
  timestamp.style.display = "none";

  taskInfo.innerHTML = task.description;
  taskInfo.className = "description";
  taskInfo.style.display = "none";

  taskButtons.className = "task-buttons";

  done = task.done;

  taskData.appendChild(taskTitle);
  taskData.appendChild(taskDate);
  taskData.appendChild(taskInfo);
  taskData.appendChild(timestamp);

  // Add info-button at the end of task.
  const buttonInfo = document.createElement("button");
  const info = document.createElement("i");
  info.setAttribute("class", "fas fa-info");
  buttonInfo.setAttribute("id", "task-info-button");
  buttonInfo.setAttribute(
    "onclick",
    "checkInfo(this.parentNode.parentNode, this.parentNode, this)"
  );
  buttonInfo.appendChild(info);
  taskButtons.appendChild(buttonInfo);

  // Add checkbox-button at the end of task.
  const buttonCheckbox = document.createElement("button");
  const checkbox = document.createElement("i");
  checkbox.setAttribute("class", "fas fa-check");
  buttonCheckbox.setAttribute("id", "task-done-button");
  buttonCheckbox.setAttribute(
    "onclick",
    "taskChecked(this.parentNode.parentNode, this.parentNode, this)"
  );
  buttonCheckbox.appendChild(checkbox);
  taskButtons.appendChild(buttonCheckbox);

  // Add edit-button at the end of task.
  const buttonEdit = document.createElement("button");
  const editIcon = document.createElement("i");
  editIcon.setAttribute("class", "fas fa-pencil-alt");
  buttonEdit.setAttribute("id", "task-edit-button");
  buttonEdit.setAttribute(
    "onclick",
    "taskEdit(this.parentNode.parentNode, this.parentNode, this)"
  );
  buttonEdit.appendChild(editIcon);
  taskButtons.appendChild(buttonEdit);

  // Add delete-button at the end of task.
  const buttonDelete = document.createElement("button");
  const deleteIcon = document.createElement("i");
  deleteIcon.setAttribute("class", "fas fa-trash-alt");
  buttonDelete.setAttribute("id", "task-delete-button");
  buttonDelete.setAttribute(
    "onclick",
    "deleteTask(this.parentNode.parentNode)"
  );
  buttonDelete.appendChild(deleteIcon);
  taskButtons.appendChild(buttonDelete);

  listItem.appendChild(taskData);
  listItem.appendChild(taskButtons);

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

  document.querySelector("#task-list").appendChild(listItem);
  document.querySelector("#task-title").value = "";
  document.querySelector("#task-date").value = "";
};

// Toggle sorting tasks due deadline-date and due created-date.
const sortTasks = () => {
  let list, i, switching, listItem, dateValue, shouldSwitch, timestamp;
  if (!sort) {
    list = document.querySelector("#task-list");
    switching = true;
    while (switching) {
      switching = false;
      listItem = list.getElementsByTagName("LI");
      for (i = 0; i < listItem.length - 1; i++) {
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
  } else if (sort) {
    list = document.querySelector("#task-list");
    switching = true;
    while (switching) {
      switching = false;
      listItem = list.getElementsByTagName("LI");
      for (i = 0; i < listItem.length - 1; i++) {
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
};

// Task description (end edit) when clicked on info-button.
const checkInfo = (listItem, taskButtons, buttonInfo) => {
  buttonInfo.classList.toggle("checked");
  taskInfo = listItem.childNodes[0].childNodes[2];
  buttonCheck = taskButtons.childNodes[1];
  buttonEdit = taskButtons.childNodes[2];

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
const taskChecked = (listItem, taskButtons, buttonCheckbox) => {
  listItem.classList.toggle("checked");
  buttonInfo = taskButtons.childNodes[0];
  buttonEdit = taskButtons.childNodes[2];

  if (listItem.className === "checked") {
    done = true;
    buttonCheckbox.firstChild.setAttribute("class", "fas fa-check-double");
    buttonCheckbox.setAttribute("class", "checked");
    buttonInfo.setAttribute("class", "disabled");
    buttonInfo.setAttribute("disabled", "true");
    buttonEdit.setAttribute("class", "disabled");
    buttonEdit.setAttribute("disabled", "true");
  } else if (listItem.className !== "checked") {
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
const taskEdit = (listItem, taskButtons, buttonEdit) => {
  buttonEdit.setAttribute("id", "task-edit-button-editing");
  buttonEdit.setAttribute(
    "onclick",
    "finishEdit(this.parentNode.parentNode, this.parentNode, this)"
  );

  // taskTitle = listItem.childNodes[0];
  taskTitle = listItem.childNodes[0].childNodes[0];
  taskTitle.setAttribute("contenteditable", true);
  taskTitle.setAttribute("id", "title-editing");
  taskTitle.focus();

  // taskDate = listItem.childNodes[1];
  taskDate = listItem.childNodes[0].childNodes[1];
  taskDate.setAttribute("contenteditable", true);
  taskDate.setAttribute("id", "date-editing");

  buttonInfo = taskButtons.childNodes[0];
  buttonInfo.setAttribute("class", "disabled");
  buttonInfo.setAttribute("disabled", "true");

  buttonCheck = taskButtons.childNodes[1];
  buttonCheck.setAttribute("class", "disabled");
  buttonCheck.setAttribute("disabled", "true");

  listItem.addEventListener("keydown", (event) => {
    if (event.keyCode === 13 || event.code === "Enter") {
      event.preventDefault();
      finishEdit(listItem, taskButtons, buttonEdit);
    }
  });
};

// Finish editing task when edit-button clicked again (or enter when editing task).
const finishEdit = (listItem, taskButtons, buttonEdit) => {
  const testTaskTitle = taskTitle.innerHTML;
  const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/;
  const testDate = taskDate.innerHTML;
  const match = regex.test(testDate);

  if (match === false) {
    message.innerHTML = "Enter date in format YYYY-MM-DD.";
    showMessageModal();
  } else if (testTaskTitle === "") {
    message.innerHTML = "Enter task title!";
    showMessageModal();
  } else {
    buttonEdit.setAttribute("id", "task-edit-button");
    buttonEdit.setAttribute(
      "onclick",
      "taskEdit(this.parentNode.parentNode, this.parentNode, this)"
    );

    taskTitle = listItem.childNodes[0].childNodes[0];
    taskTitle.setAttribute("contenteditable", false);
    taskTitle.setAttribute("id", "no-editing");

    taskDate = listItem.childNodes[0].childNodes[1];
    taskDate.setAttribute("contenteditable", false);
    taskDate.setAttribute("id", "no-editing");

    buttonInfo = taskButtons.childNodes[0];
    buttonInfo.removeAttribute("class", "disabled");
    buttonInfo.removeAttribute("disabled", "true");

    buttonCheck = taskButtons.childNodes[1];
    buttonCheck.removeAttribute("class", "disabled");
    buttonCheck.removeAttribute("disabled");
    updateTask(listItem);
  }
};

// Delete one task from the list when clicked on a "trash can" icon.
const deleteTask = (listItem) => {
  listItem.style.display = "none";
  let key = listItem.id;
  database
    .ref(userId + "/todos/")
    .child(key)
    .remove();
};

// Update task and send updated data to Firebase.
const updateTask = (listItem) => {
  let key = listItem.id;

  let updatedTask = {
    title: listItem.childNodes[0].childNodes[0].innerHTML,
    date: listItem.childNodes[0].childNodes[1].innerHTML,
    description: listItem.childNodes[0].childNodes[2].innerHTML,
    timestamp: listItem.childNodes[0].childNodes[3].innerHTML,
    done: done,
    key: key,
  };

  let updates = {};
  updates[userId + "/todos/" + key] = updatedTask;
  database.ref().update(updates);
};

// Edit and update user email.
const updateUserEmail = () => {
  let user = firebase.auth().currentUser;
  let newEmail = document.querySelector("#email").value;

  if (newEmail !== "") {
    user
      .updateEmail(newEmail)
      .then(function () {
        // Update successful.
        database.ref("users/" + userId).set({
          displayName: user.displayName,
          email: newEmail,
        });
        document.querySelector("#email").value = "";
        hideModal(userModal);
        message.innerHTML = "Email updated successfully";
        showMessageModal();
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        message.innerHTML = errorMessage;
        showMessageModal();
      });
  } else {
    message.innerHTML = "Enter new email to update!";
    showMessageModal();
  }
};

// Edit and update user password.
const updateUserPassword = () => {
  let user = firebase.auth().currentUser;
  let newPassword = document.querySelector("#password").value;

  if (newPassword !== "") {
    user
      .updatePassword(newPassword)
      .then(function () {
        // Update successful.
        document.querySelector("#password").value = "";
        hideModal(userModal);
        message.innerHTML = "Password updated successfully";
        showMessageModal();
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        message.innerHTML = errorMessage;
        showMessageModal();
      });
  } else {
    message.innerHTML = "Enter new password to update!";
    showMessageModal();
  }
};

// Edit and update user name.
const updateUserName = () => {
  let user = firebase.auth().currentUser;
  let newUsername = document.querySelector("#username").value;

  if (newUsername !== "") {
    user
      .updateProfile({
        displayName: newUsername,
      })
      .then(function () {
        // Update successful.
        database.ref("users/" + userId).set({
          displayName: newUsername,
          email: user.email,
        });
        document.querySelector("#welcome").innerText =
          "Welcome " + newUsername + "!";
        document.querySelector("#username").value = "";
        hideModal(userModal);
        message.innerHTML = "Name updated successfully";
        showMessageModal();
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        message.innerHTML = errorMessage;
        showMessageModal();
      });
  } else {
    message.innerHTML = "Enter new name to update!";
    showMessageModal();
  }
};

// Reset input.
const resetInput = () => {
  document.querySelector("#email").value = "";
  document.querySelector("#password").value = "";
  document.querySelector("#username").value = "";
};

// Show modal with delete-user-message.
const showDeleteUserModal = () => {
  deleteUserCancelButton.setAttribute("onclick", "hideModal(deleteUserModal)");
  deleteUserConfirmButton.setAttribute("onclick", "deleteUser()");
  closeDeleteUserModal.setAttribute("onclick", "hideModal(deleteUserModal)");
  deleteUserModal.style.display = "block";

  window.onclick = function (event) {
    if (event.target === deleteUserModal) {
      hideModal(deleteUserModal);
    }
  };
};

// Delete user from database.
const deleteUser = () => {
  var user = firebase.auth().currentUser;
  user
    .delete()
    .then(function () {
      // User deleted.
      deleteAllTasks();
      database.ref("users/" + userId).remove();
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      message.innerHTML = errorMessage;
      showMessageModal();
    });
};

// Show modal with error-message.
const showMessageModal = () => {
  messageModal.style.display = "block";
  okButton.setAttribute("onclick", "hideModal(messageModal)");
  closeMessageModal.setAttribute("onclick", "hideModal(messageModal)");

  window.onclick = function (event) {
    if (event.target === messageModal) {
      hideModal(messageModal);
    }
  };
};

// Show modal with delete-message.
const showDeleteModal = () => {
  deleteTasksCancelButton.setAttribute(
    "onclick",
    "hideModal(deleteTasksModal)"
  );
  deleteTasksButton.setAttribute("onclick", "deleteAllTasks()");
  closeDeleteTasksModal.setAttribute("onclick", "hideModal(deleteTasksModal)");
  deleteTasksModal.style.display = "block";

  window.onclick = function (event) {
    if (event.target === deleteTasksModal) {
      hideModal(deleteTasksModal);
    }
  };
};

// Delete all tasks from list and hide modal.
const deleteAllTasks = () => {
  database.ref(userId + "/todos/").remove();
  let list = document.querySelector("#task-list");
  let listItem = list.getElementsByTagName("LI");

  for (i = 0; i < listItem.length; i++) {
    listItem[i].style.display = "none";
  }
  hideModal(deleteTasksModal);
};

// Show modal for user edit profile function.
const showUserModal = () => {
  closeUpdateButton.setAttribute("onclick", "hideModal(userModal)");
  closeUserModal.setAttribute("onclick", "hideModal(userModal)");
  userModal.style.display = "block";

  window.onclick = function (event) {
    if (event.target === userModal) {
      hideModal(userModal);
    }
  };
};

// Hide modal.
const hideModal = (modal) => {
  modal.style.display = "none";
};

// Event listeners to buttons.
addTaskButton.addEventListener("click", createTask);
sortTasksButton.addEventListener("click", sortTasks);
deleteAllTasksButton.addEventListener("click", showDeleteModal);
userProfileButton.addEventListener("click", showUserModal);
logoutButton.addEventListener("click", signOut);
updateEmailButton.addEventListener("click", updateUserEmail);
updatePasswordButton.addEventListener("click", updateUserPassword);
updateNameButton.addEventListener("click", updateUserName);
resetButton.addEventListener("click", resetInput);
deleteUserButton.addEventListener("click", showDeleteUserModal);
enterTask.addEventListener("keydown", enterTaskEvent);
