// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration



const firebaseConfig = {
  apiKey: "AIzaSyAV9MZw63cJubTUMj8C6bm5G5xTn4s847c",

  authDomain: "pray-app-dzialodow.firebaseapp.com",

  databaseURL:
    "https://pray-app-dzialodow-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "pray-app-dzialodow",

  storageBucket: "pray-app-dzialodow.appspot.com",

  messagingSenderId: "817782987044",

  appId: "1:817782987044:web:1adeb2e41ac9e4246a7bb1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, "App");
export const auth = getAuth(app);
auth.languageCode = "pl";

export default app;
