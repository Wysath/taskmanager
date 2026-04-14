// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAYBr6dmlPjp0RxRo6FxoJCxltg1auhag",
  authDomain: "taskmanager-filrouge-57492.firebaseapp.com",
  projectId: "taskmanager-filrouge-57492",
  storageBucket: "taskmanager-filrouge-57492.firebasestorage.app",
  messagingSenderId: "529740290484",
  appId: "1:529740290484:web:7799656e332e2e7ada3ae1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
export const auth = getAuth(app);