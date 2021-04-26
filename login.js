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

// Sign up to create a new account.
document.querySelector("#sign-up-button").addEventListener("click", () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let displayName = document.getElementById("username").value;
    
    if (displayName === "") {
        alert("Enter your name!");
    } else {
        const promise = auth.createUserWithEmailAndPassword(email, password);
    promise
        .then((userCredential) => {
            // Signed up 
            var user = userCredential.user;
            window.location = "index.html";
            //alert("Signed Up: " + email);
            user.updateProfile({
                displayName: displayName
            })
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
        });
    }
});

// Sign in with existing account.
document.querySelector("#sign-in-button").addEventListener("click", () => {
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    
    const promise = auth.signInWithEmailAndPassword(email, password);
    promise
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            window.location = "index.html";
            //alert("Signed In: " + email);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
        });
});

// Reset input.
document.querySelector("#cancel-button").addEventListener("click", () => {
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("username").value = "";
});