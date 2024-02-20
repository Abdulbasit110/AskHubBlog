import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import {
  setDoc,
  doc,
  getFirestore,
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyALXRtZPpaycylaG3zBkc1jdgDOE2Up874",
  authDomain: "askhubblog-basit.firebaseapp.com",
  projectId: "askhubblog-basit",
  storageBucket: "askhubblog-basit.appspot.com",
  messagingSenderId: "1012568171216",
  appId: "1:1012568171216:web:9ba7b541ccb7f90748b4d5",
  measurementId: "G-0CP1MSTBH2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const currentPageName = window.location.pathname.split("/").pop();

//! HTML ELEMENTS
const signWithGoogleButton = document.getElementById("signWithGoogle");
const signInWithEmailAndPasswordButton = document.getElementById(
  "signInWithEmailAndPassword"
);
const email = document.getElementById("email");
const password = document.getElementById("password");
const Signupbtn = document.getElementById("Signupbtn");
const logInbtn = document.getElementById("logInbtn");
const logOutButton = document.getElementById("logOutButton");
const newEmail = document.getElementById("newEmail");
const newPassword = document.getElementById("newPassword");
const Signup = document.getElementById("newAccountPage");
const logIn = document.getElementById("logIn");
const createAccountbtn = document.getElementById("createAccountbtn");
const createAccount = document.getElementById("createAccount");
const showPassword = document.getElementById("showPassword");
const newBlogForm = document.getElementById("newBlogForm");
Signup ? (Signup.style.display = "none") : null;
newBlogForm ? (newBlogForm.style.display = "none") : null;

function myFunction() {
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
}
const logInUser = () => {
  const userEmail = email.value;
  const userPassword = password.value;

  if (!userEmail || !userPassword) {
    console.log("Email or password is empty");
    return; // Stop the function if fields are empty
  }

  signInWithEmailAndPassword(auth, userEmail, userPassword)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("Successfully logged in:", user);
      // Redirect or perform actions after successful login
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Login failed:", errorCode, errorMessage);
      // Display error message to the user
    });
};

const showNewAccountForm = () => {
  Signup.style.display = "flex";
  logIn.style.display = "none";
};
const signupUser = () => {
  console.log(createAccountbtn);
  createUserWithEmailAndPassword(auth, newEmail.value, newPassword.value)
    .then((userCredential) => {
      const user = userCredential.user;
      if (user.emailVerified) {
        return;
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    });
};

const observer = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (currentPageName !== "blog.html") {
        window.location.href = "blog.html";
      }
      console.log(user);
    } else {
      if (currentPageName !== "index.html" && currentPageName !== "") {
        window.location.href = "/";
      }

      console.log("User Is not Logged In!");
    }
  });
};

observer();

const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
};

const logOut = () => {
  console.log(logOutButton);
  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
};

const newBlog = () => {
  window.location.href = "newBlog.html";
};

//! EVENT LISTENERS
signWithGoogleButton &&
  signWithGoogleButton.addEventListener("click", signInWithGoogle);

logOutButton && logOutButton.addEventListener("click", logOut);

createAccountbtn && createAccountbtn.addEventListener("click", signupUser);
createAccount && createAccount.addEventListener("click", showNewAccountForm);
logInbtn && logInbtn.addEventListener("click", logInUser);

showPassword && showPassword.addEventListener("click", myFunction);
