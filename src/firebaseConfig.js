import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqaO972MvPl1Hjxwi7SMVnwe7yUKKUJ-g",
  authDomain: "lokstallet-5147c.firebaseapp.com",
  projectId: "lokstallet-5147c",
  storageBucket: "lokstallet-5147c.firebasestorage.app",
  messagingSenderId: "1031492726413",
  appId: "1:1031492726413:web:19b3e635337900aee17cc4",
  measurementId: "G-ZFDGFC2884"
};

export const app = initializeApp(firebaseConfig);

// Persistent local cache: repeat visits paint instantly from IndexedDB
// while data refreshes in the background, and it's far more resilient
// on flaky mobile connections than an uncached one-shot fetch.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

