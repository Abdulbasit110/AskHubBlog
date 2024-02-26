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
  deleteDoc,
  getFirestore,
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  where,
  getDocs,
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
const mobileHomeLink = document.getElementById("mobileHomeLink");
const mobileLogoutLink = document.getElementById("mobileLogoutLink");
const logoutLink = document.getElementById("logoutLink");
const homeLink = document.getElementById("homeLink");
const askhubblog = document.getElementById("askhubblog");
const profile = document.getElementById("profile");
const loadingBar = document.getElementById("loadingBar");
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
const backToBlogs = async () => {
  newBlogForm.style.display = "none";
  blogs.style.display = "block";
  loadBlogs();
};
const previewAllBlogs = () => {
  // const loadingBar = document.getElementById("loadingBar");
  loadingBar.style.display = "flex";

  const q = query(
    collection(db, "blogs"),
    orderBy("timestamp", "desc"), // Order blogs by timestamp in descending order
    limit(10) // Limit the number of blogs to display
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    if (!querySnapshot.empty) {
      loadingBar.style.display = "none";
      const messagesHTML = querySnapshot.docs
        .map((doc) => {
          const blog = doc.data();
          return generateBlogHTML(blog); // Using the generateBlogHTML function here
        })
        .join("");

      blogs.innerHTML = messagesHTML;
      const read = document.querySelectorAll("#read");
      read.forEach((r) => {
        r.addEventListener("click", previewBlog);
      });
    } else {
      loadingBar.style.display = "none";
      blogs.innerHTML = `
        <h1 class="text-4xl font-bold text-gray-900">No blogs found.</h1>
      `;
    }
  });
};

const submitBlogfunc = async () => {
  // Get the loader element
  newBlogForm.style.display = "none";
  loadingBar.style.display = "flex"; // Display the loader

  const user = auth.currentUser;
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").files[0];
  const storageRef = ref(storage, `images/${image.name}`);
  const uploadTask = uploadBytesResumable(storageRef, image);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // You can update the loader here if needed
    },
    (error) => {
      console.log(error);
      loader.style.display = "none"; // Hide the loader in case of error
    },
    async () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        const { email, displayName, photoURL, uid } = user;
        const id = new Date().getTime();

        setDoc(doc(db, "blogs", `${id}`), {
          email,
          uid,
          displayName,
          photoURL,
          timestamp: id,
          id,
          title,
          content,
          imageUrl: downloadURL,
          description,
        })
          .then(() => {
            blogs.style.display = "block";
            // loadingBar.style.display = "none"; // Hide the loader when operation is complete
          })
          .catch((error) => {
            console.log(error);
            loadingBar.style.display = "none"; // Hide the loader in case of error
          });
      });
    }
  );
};

const generateBlogHTML = (blog) => {
  const user = auth.currentUser;
  // console.log(typeof blog.id);
  const date = new Date(blog.timestamp);
  // console.log(date);
  const hours = date.getHours();
  // console.log(hours);
  const minutes = date.getMinutes();
  // console.log(minutes);
  const formattedDate = `${hours}:${minutes}`;
  const content = blog.content;
  // console.log(typeof content);
  if (user.uid === blog.uid) {
    return `

    <div class="py-12 border-2 border-base-300 my-3 rounded-xl">
    
      <div class="flex flex-wrap lg:flex-nowrap items-center">
        <div class="w-full lg:w-auto px-4 mb-8 lg:mb-0">
          <img class="block w-44 h-30" src="${blog.imageUrl}" alt="${
      blog.title
    }">
        </div>
        <div class="w-full lg:w-9/12 px-4 mb-10 lg:mb-0">
          <div class="max-w-2xl">
            <span class="block text-gray-400 mb-1">${formattedDate}</span>
            <h1 class="text-3xl font-bold text-gray-900">${blog.title}</h1>
            <p class="text-2xl font-semibold text-gray-900">${content.substr(
              0,
              50
            )}...</p>
          </div>
        </div>
        <div class="w-full lg:w-auto px-4 ml-auto text-right">
          <a class="inline-flex items-center text-xl font-semibold text-orange-900 hover:text-gray-900" href="#">
            <button  id="read" dataset_item="${
              blog.id
            }" class="mr-2" >Read</button>
            <svg class="animate-bounce" width="16" height="16" viewbox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.33301 14.6668L14.6663 1.3335" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M1.33301 1.3335H14.6663V14.6668" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </a>
          <button class="btn btn-error mt-32 me-2" id="delete" dataset_delete="${
            blog.id
          }">Delete</button>
        </div>
      </div>
    </div>
  `;
  } else {
    return `
    <div class="py-12 border-2 border-base-300 my-3 rounded-xl">
    
      <div class="flex flex-wrap lg:flex-nowrap items-center">
        <div class="w-full lg:w-auto px-4 mb-8 lg:mb-0">
          <img class="block w-44 h-30" src="${blog.imageUrl}" alt="${
      blog.title
    }">
        </div>
        <div class="w-full lg:w-9/12 px-4 mb-10 lg:mb-0">
          <div class="max-w-2xl">
            <span class="block text-gray-400 mb-1">${formattedDate}</span>
            <h1 class="text-3xl font-bold text-gray-900">${blog.title}</h1>
            <p class="text-2xl font-semibold text-gray-900">${content.substr(
              0,
              50
            )}...</p>
          </div>
        </div>
        <div class="w-full lg:w-auto px-4 ml-auto text-right">
          <a class="inline-flex items-center text-xl font-semibold text-orange-900 hover:text-gray-900" href="#">
            <button  id="read" dataset_item="${
              blog.id
            }" class="mr-2" >Read</button>
            <svg class="animate-bounce" width="16" height="16" viewbox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.33301 14.6668L14.6663 1.3335" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M1.33301 1.3335H14.6663V14.6668" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </a>
          
        </div>
      </div>
    </div>
    `;
  }
};
const deleteBlog = async (e) => {
  const blogId = e.target.getAttribute("dataset_delete"); // Assuming you're passing the blog id through a data attribute
  // console.log(blogId);
  try {
    await deleteDoc(doc(db, "blogs", `${blogId}`));
    loadBlogs();
    console.log("Blog deleted successfully");
  } catch (error) {
    console.error("Error deleting blog:", error);
    // Handle error, maybe show a message to the user
  }
};

const loadBlogs = () => {
  loadingBar.style.display = "flex";
  const user = auth.currentUser;
  const uid = user.uid;
  // console.log(user);
  const q = query(
    collection(db, "blogs"),
    where("uid", "==", `${uid}`),
    orderBy("timestamp"),
    limit(25)
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    // console.log(querySnapshot);
    if (!querySnapshot.empty) {
      loadingBar.style.display = "none";
      const messagesHTML = querySnapshot.docs
        .map((doc) => {
          const blog = doc.data();
          // console.log(blog);
          return generateBlogHTML(blog); // Using the generateBlogHTML function here
        })
        .join("");

      blogs.innerHTML = `<div class="container mx-auto px-4 text-5xl font-bold flex justify-start my-6 font-mono">MY BLOGS</div>${messagesHTML}`;
      const read = document.querySelectorAll("#read");
      const deleteBtn = document.querySelectorAll("#delete");
      deleteBtn.forEach((d) => {
        d.addEventListener("click", deleteBlog);
      });
      read.forEach((r) => {
        r.addEventListener("click", previewBlog);
        // console.log(r);
      });
    } else {
      loadingBar.style.display = "none";
      blogs.innerHTML = `
      <div class="h-80 sm:ms-10 ">
 <h1 class="mt-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl ">Let's start bloging / asking</h1> 
<p class="mt-10 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">your first blog / question is just few clicks away!!</p>
<a id="btn" href="#" class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 mt-20">
    Start Now
    <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
  </svg>
</a> </div>`;
    }
    const btn = document.getElementById("btn");
    btn && btn.addEventListener("click", addBlog);
    // console.log(btn);
  });
};

const previewBlog = (e) => {
  let blogId = e.target.getAttribute("dataset_item");
  blogId = Number(blogId);
  // console.log(typeof blogId);
  const q = query(collection(db, "blogs"), where("id", "==", blogId));
  // console.log(q);
  // const querySnapshot = await getDocs(q);
  // console.log(querySnapshot);
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    // console.log(querySnapshot);
    const messagesHTML = querySnapshot.docs
      .map((doc) => {
        const blog = doc.data();
        const date = new Date(blog.timestamp);
        // console.log(date);
        const hours = date.getHours();
        // console.log(hours);
        const minutes = date.getMinutes();
        // console.log(minutes);
        const formattedDate = `${hours}:${minutes}`;
        // console.log(blog);
        return `
  <div class="max-w-screen-lg mx-auto my-10 ">
    <div class="mb-4 md:mb-0 w-full mx-auto relative">
      <div class="px-4 lg:px-0">
        <h2 class="text-4xl font-semibold text-gray-800 leading-tight">
          ${blog.title}
        </h2>
        <a
          href="#"
          class="py-2 text-green-700 inline-flex items-center justify-center mb-2 me-4"
        >
          ${formattedDate}
        </a>
        <a
          href="#"
          class="py-2 text-green-700 inline-flex items-center justify-center mb-2 "
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
        <div class="p-4 border-t border-b md:border md:rounded w-auto">
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
  </div>
  <form class="max-w-2xl bg-white rounded-lg border p-2 mx-auto mt-20 mb-20">
    <div class="px-3 mb-2 mt-2">
        <textarea placeholder="comment" class="w-full bg-gray-100 rounded border border-gray-400 leading-normal resize-none h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"></textarea>
    </div>
    <div class="flex justify-end px-4">
        <input type="submit" class="px-2.5 py-1.5 rounded-md text-white text-sm bg-indigo-500" value="Comment">
    </div>
</form>`;
      })
      .join("");
    // console.log(messagesHTML);
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
      // console.log(user);
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
    // console.log(user.emailVerified);
    if (user && user.emailVerified) {
      if (currentPageName !== "blog.html") {
        window.location.href = "blog.html";
      }
      loadBlogs();
      userEmail.textContent = user.email;
      profile.src = user.photoURL;
      // console.log(user.photoURL);
      // console.log(user.email);
      // console.log(profile);
    } else {
      if (currentPageName !== "index.html" && currentPageName !== "") {
        window.location.href = "index.html";
      }
      const bool = Signup.style.display === "flex";
      if (bool && newEmail.value) {
        signupErrorMessageElement.textContent = "Invalid Email";
        signupErrorMessageElement.style.display = "block"; // Make sure the element is visible
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
  // console.log(logOutButton);
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
mobileLogoutLink && mobileLogoutLink.addEventListener("click", logOut);
logoutLink && logoutLink.addEventListener("click", logOut);
showPassword && showPassword.addEventListener("click", myFunction);
addBlogbtn && addBlogbtn.addEventListener("click", addBlog);
submitBlog && submitBlog.addEventListener("click", submitBlogfunc);
mobileHomeLink && mobileHomeLink.addEventListener("click", previewAllBlogs);
homeLink && homeLink.addEventListener("click", previewAllBlogs);
askhubblog && askhubblog.addEventListener("click", backToBlogs);
