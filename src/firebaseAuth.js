// Separate entry point for firebase/auth so its code only loads for the
// admin/login pages, not for public visitors browsing events.
import { getAuth } from "firebase/auth";
import { app } from "./firebaseConfig";

export const auth = getAuth(app);
