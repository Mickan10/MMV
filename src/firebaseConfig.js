import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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

// Rent minnescache (standard) – ingen IndexedDB-persistens mellan sidladdningar.
// Vi körde tidigare med persistentLocalCache, men den sparade gammal
// inloggnings-/behörighetsdata i webbläsaren som blev inaktuell varje gång
// koden uppdaterades (särskilt i adminpanelen), och krävde att man manuellt
// rensade webbplatsdata för att logga in igen. Firestore-anropen är ändå
// snabba (under en sekund), så vinsten med persistens är inte värd krånglet.
export const db = getFirestore(app);

