// Import the functions you need from the SDKs you need
import firebaseConfig from "./config";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Initialize Firebase
const app = initializeApp(firebaseConfig, "App");
export const auth = getAuth(app);

auth.languageCode = "pl";

export default app;
