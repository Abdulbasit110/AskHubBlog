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
  where,
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
const storage = getStorage(app);
const user = auth.currentUser;
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
const userEmail = document.getElementById("userEmail");
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
const submitBlogfunc = async () => {
  const user = auth.currentUser;
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
    async () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        const { email, displayName, photoURL, uid } = user;
        const id = new Date().getTime();
        console.log("File available at", downloadURL);
        setDoc(doc(db, "blogs", `${id}`), {
          email,
          uid,
          displayName,
          photoURL,
          timestamp: new Date(),
          id,
          title,
          content,
          imageUrl: downloadURL,
          description,
        });
      });
    }
  );
  newBlogForm.style.display = "none";
  blogs.style.display = "block";
};

const loadBlogs = () => {
  const user = auth.currentUser;
  const uid = user.uid;
  console.log(user);
  const q = query(
    collection(db, "blogs"),
    where("uid", "==", `${uid}`),
    orderBy("timestamp"),
    limit(25)
  );
  console.log(q);
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    if (!querySnapshot.empty) {
      const messagesHTML = querySnapshot.docs
        .map((doc) => {
          const blog = doc.data();
          console.log(blogs);
          const date = new Date(blog.timestamp);
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const formattedDate = `${hours}:${minutes}`;
          console.log(formattedDate);

          return `
          <div class="py-12 border-2 border-base-300 my-3 rounded-xl">

        <div class="flex flex-wrap lg:flex-nowrap items-center">
          <div class="w-full lg:w-auto px-4 mb-8 lg:mb-0">
            <img class="block w-44 h-30" src="${blog.imageUrl}" alt="${blog.title}">
          </div>
          <div class="w-full lg:w-9/12 px-4 mb-10 lg:mb-0">
            <div class="max-w-2xl">
              <span class="block text-gray-400 mb-1">${formattedDate}</span>
              <h1 class="text-3xl font-bold text-gray-900">${blog.title}</h1>
              <p class="text-2xl font-semibold text-gray-900">${blog.content}</p>
            </div>
          </div>
          <div class="w-full lg:w-auto px-4 ml-auto text-right">
            <a class="inline-flex items-center text-xl font-semibold text-orange-900 hover:text-gray-900" href="#">
            <button id="read"><span  class="mr-2" data_id = "${blog.id}">Read</span></button>
              <svg class="animate-bounce" width="16" height="16" viewbox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.33301 14.6668L14.6663 1.3335" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M1.33301 1.3335H14.6663V14.6668" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </a>
            <button class="btn btn-error mt-32 me-2" id="delete">Delete</button>
          </div>
        </div>
      </div>
        `;
        })
        .join("");
      blogs.innerHTML = messagesHTML;
      const read = document.querySelectorAll("#read");
      const deleteBtn = document.querySelectorAll("#delete");
      deleteBtn.forEach((d, index) => {
        d.addEventListener("click", deleteBlog, index);
      });
      read.forEach((r) => {
        r.addEventListener("click", previewBlog);
        console.log(r);
      });
    } else {
      blogs.innerHTML = `
 <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Let's start bloging / asking</h1> 
<p class="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.</p>
<a id="btn" href="#" class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
    Learn more
    <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
  </svg>
</a>`;
    }
    const btn = document.getElementById("btn");
    btn && btn.addEventListener("click", addBlog);
    console.log(btn);
  });
};

const previewBlog = async (e) => {
  const blogId = e.target.data_id;
  console.log(blogId);
  const q = query(collection(db, "blogs"), where("id", "==", `${blogId}`));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messagesHTML = querySnapshot.docs
      .map((doc) => {
        const blog = doc.data();
        return `
  <div class="max-w-screen-lg mx-auto">
    <div class="mb-4 md:mb-0 w-full mx-auto relative">
      <div class="px-4 lg:px-0">
        <h2 class="text-4xl font-semibold text-gray-800 leading-tight">
          ${blog.title}
        </h2>
        <a
          href="#"
          class="py-2 text-green-700 inline-flex items-center justify-center mb-2"
        >
          ${blog.timestamp}
        </a>
        <a
          href="#"
          class="py-2 text-green-700 inline-flex items-center justify-center mb-2"
        >
          ${blog.description}
        </a>
      </div>

      <img
        alt="${blog.title}"
        src="${blog.imageUrl}"
        class="w-full object-cover lg:rounded"
        style="height: 28em;"
      />
    </div>
    <div class="flex flex-col lg:flex-row lg:space-x-12">
      <div class="px-4 lg:px-0 mt-12 text-gray-700 text-lg leading-relaxed w-full lg:w-3/4">
        <p class="pb-6">${blog.content}</p>
      </div>

      <div class="w-full lg:w-1/4 m-auto mt-12 max-w-screen-sm">
        <div class="p-4 border-t border-b md:border md:rounded">
          <div class="flex py-2">
            <img
              src="${blog.photoURL}"
              class="h-10 w-10 rounded-full mr-2 object-cover"
            />
            <div>
              <p class="font-semibold text-gray-700 text-sm">
                ${blog.displayName}
              </p>
              <p class="font-semibold text-gray-600 text-xs"> Author </p>
              <p class="font-semibold text-gray-600 text-xs"> ${blog.email} </p>
            </div>
          </div>
          <p class="text-gray-700 py-3">
            Mike writes about technology Yourself required no at thoughts
            delicate landlord it be. Branched dashwood do is whatever it.
          </p>
          <button class="px-2 py-1 text-gray-100 bg-green-700 flex w-full items-center justify-center rounded">
            Follow
            <i class="bx bx-user-plus ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  </div>`;
      })
      .join("");
    blogs.innerHTML = messagesHTML;
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
      loadBlogs();
      userEmail.textContent = user.email;
      console.log(user.email);
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
