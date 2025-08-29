import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqaO972MvPl1Hjxwi7SMVnwe7yUKKUJ-g",
  authDomain: "lokstallet-5147c.firebaseapp.com",
  projectId: "lokstallet-5147c",
  storageBucket: "lokstallet-5147c.firebasestorage.app",
  messagingSenderId: "1031492726413",
  appId: "1:1031492726413:web:19b3e635337900aee17cc4",
  measurementId: "G-ZFDGFC2884"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
