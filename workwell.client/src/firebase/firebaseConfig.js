// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBZ187hvCszahmyLMKoEGVodMPY46JokjI",
    authDomain: "workwell-1306b.firebaseapp.com",
    projectId: "workwell-1306b",
    storageBucket: "workwell-1306b.firebasestorage.app",
    messagingSenderId: "150453512409",
    appId: "1:150453512409:web:fad4e834028dcbe42df6c8",
    measurementId: "G-20SQKGNXMT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification };