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
// console.log(email, password);
const Signupbtn = document.getElementById("Signupbtn");
console.log(Signupbtn);
const logOUtButton = document.getElementById("logOutButton");
const newEmail = document.getElementById("newEmail");
const newPassword = document.getElementById("newPassword");
const Signup = document.getElementById("newAccountPage");
const logIn = document.getElementById("logIn");
const newBlogForm = document.getElementById("newBlogForm");

const signupUser = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
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

// signInWithEmailAndPasswordButton &&
//   signInWithEmailAndPasswordButton.addEventListener("click", signupUser);
logOUtButton && logOUtButton.addEventListener("click", logOut);
Signupbtn && Signupbtn.addEventListener("click", signupUser);
