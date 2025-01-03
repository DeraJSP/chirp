// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDSeAQh0a1SoJ6mFBDNIHNy2MgrssW8foI",
  authDomain: "react-course-6583c.firebaseapp.com",
  projectId: "react-course-6583c",
  storageBucket: "react-course-6583c.appspot.com",
  messagingSenderId: "421490806253",
  appId: "1:421490806253:web:859c974d2a3852c3022be4",
  measurementId: "G-2QJVZNZ41R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
