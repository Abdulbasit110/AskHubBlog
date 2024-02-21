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
const db = getFirestore(app);
const storage = getStorage();
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
const signupErrorMessageElement = document.getElementById("signupErrorMessage");
const addBlogbtn = document.getElementById("addBlog");
const blogs = document.getElementById("blogs");
const submitBlog = document.getElementById("submitBlog");
Signup ? (Signup.style.display = "none") : null;
newBlogForm ? (newBlogForm.style.display = "none") : null;

function myFunction() {
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
}

const addBlog = async () => {
  newBlogForm.style.display = "block";
  blogs.style.display = "none";
};
const submitBlogfunc = () => {
  console.log("inside submit blog function");
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").files[0];
  const storageRef = ref(storage, `images/${image.name}`);
  const uploadTask = uploadBytesResumable(storageRef, image);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      console.log(snapshot);
    },
    (error) => {
      console.log(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
        setDoc(doc(db, "blogs", title), {
          timestamp: new Date(),
          id: new Date().getTime(),
          title,
          content,
          image: downloadURL,
          description,
        });
      });
      getBlogs();
    }
  );
};

const getBlogs = async () => {
  const q = query(collection(db, "blogs"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
};

const logInUser = () => {
  const userEmail = email.value;
  const userPassword = password.value;

  if (!userEmail || !userPassword) {
    console.log("Email or password is empty");
    // Optionally, you can update the UI to inform the user that the email or password fields are empty
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
      // Display error message to the user
      console.error("Login failed:", errorCode, errorMessage);

      // Check if the error code is related to the wrong password
      if (errorCode === "auth/wrong-password") {
        // Update your UI here to show the error message
        const errorElement = document.getElementById("loginError"); // Assuming you have an element with id="loginError"
        errorElement.textContent = "Incorrect password. Please try again."; // Set the text content to your error message
        errorElement.style.display = "block"; // Make sure the element is visible
      } else {
        // Handle other types of errors (e.g., user not found)
        const errorElement = document.getElementById("loginError"); // Reuse the same error element for other errors
        errorElement.textContent = errorMessage; // Use the Firebase error message directly
        errorElement.style.display = "block";
      }
    });
};

const showNewAccountForm = () => {
  Signup.style.display = "flex";
  logIn.style.display = "none";
};
const signupUser = () => {
  const newEmailValue = newEmail.value;
  const newPasswordValue = newPassword.value;

  if (!newEmailValue || !newPasswordValue) {
    console.log("Email or password is empty");
    // Optionally, update UI to inform the user that the email or password cannot be empty.
    return; // Stop the function if fields are empty.
  }

  createUserWithEmailAndPassword(auth, newEmailValue, newPasswordValue)
    .then((userCredential) => {
      // User created
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      // Handle errors here, such as email already in use.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Signup failed:", errorCode, errorMessage);
      // Update UI here to display error message
      // Assuming you have this element in your HTML
      signupErrorMessageElement.textContent = errorMessage;
      signupErrorMessageElement.style.display = "block"; // Make sure the element is visible
    });
};

const observer = () => {
  onAuthStateChanged(auth, (user) => {
    console.log(user.emailVerified);
    if (user && user.emailVerified) {
      if (currentPageName !== "blog.html") {
        window.location.href = "blog.html";
      }
      console.log(user);
    } else {
      if (newEmail.value) {
        signupErrorMessageElement.textContent = "Invalid Email";
        signupErrorMessageElement.style.display = "block"; // Make sure the element is visible
      }
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
addBlogbtn && addBlogbtn.addEventListener("click", addBlog);
submitBlog && submitBlog.addEventListener("click", submitBlogfunc);
