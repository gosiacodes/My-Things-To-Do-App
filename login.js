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

const database = firebase.database();
const auth = firebase.auth();

// Global variables.
const signUpButton = document.querySelector("#sign-up-button");
const signInButton = document.querySelector("#sign-in-button");
const cancelButton = document.querySelector("#cancel-button");

const messageModal = document.getElementById("message-modal");
const spanCloseModal = document.getElementById("close-error");
const okButton = document.getElementById("ok-button");
const message = document.getElementById("error-message");

// Sign up to create a new account.
const signUp = () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let displayName = document.getElementById("username").value;
    
    if (displayName === "") {
        message.innerHTML = "Enter your name!";
        showMessageModal();
    } else {
        const promise = auth.createUserWithEmailAndPassword(email, password);
        promise
            .then((userCredential) => {
                // Signed up 
                var user = userCredential.user;
                user.updateProfile({
                    displayName: displayName
                }).then(function() {
                    // Update successful, go to main page.
                    window.location = "index.html";   
                })                
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                message.innerHTML = errorMessage;
                showMessageModal();
            });
    }    
}

// Sign in with existing account.
const signIn = () => {
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    
    const promise = auth.signInWithEmailAndPassword(email, password);
    promise
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            window.location = "index.html";
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            message.innerHTML = errorMessage;
            showMessageModal();
        });
}

// Reset input.
const resetInput = () => {
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("username").value = "";
}

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

// Hide modal.
const hideModal = (modal) => {
    modal.style.display = "none";
}

// Event listeners to buttons.
signUpButton.addEventListener("click", signUp);
signInButton.addEventListener("click", signIn);
cancelButton.addEventListener("click", resetInput);