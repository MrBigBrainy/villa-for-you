// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyASn2uBzg3uFUVALYyMem6fGN7sr7J09fQ",
    authDomain: "viilaproject.firebaseapp.com",
    projectId: "viilaproject",
    storageBucket: "viilaproject.firebasestorage.app",
    messagingSenderId: "349506691044",
    appId: "1:349506691044:web:2ef769621c308c9ca0b1f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);