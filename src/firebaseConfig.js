// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "DIN_API_KEY",
  authDomain: "lokstallet-5147c.firebaseapp.com",
  projectId: "lokstallet-5147c",
  storageBucket: "", // tomt, vi använder inte storage
  messagingSenderId: "DIN_MESSAGING_ID",
  appId: "DIN_APP_ID"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
