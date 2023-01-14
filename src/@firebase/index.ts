// import { getToken } from 'firebase/messaging/sw';
// import { getToken,getMessaging } from 'firebase/messaging';
// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAV9MZw63cJubTUMj8C6bm5G5xTn4s847c",

  authDomain: "pray-app-dzialodow.firebaseapp.com",

  databaseURL:
    "https://pray-app-dzialodow-default-rtdb.europe-west1.firebasedatabase.app/",

  projectId: "pray-app-dzialodow",

  storageBucket: "pray-app-dzialodow.appspot.com",

  messagingSenderId: "817782987044",

  appId: "1:817782987044:web:1adeb2e41ac9e4246a7bb1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, "App");
export const auth = getAuth(app);
const messaging = getMessaging(app);

auth.languageCode = "pl";

Notification.requestPermission().then(async (permission) => {
  if (permission === "granted") {
    console.log("Notification permission granted.");
    onMessage(messaging, (payload) => {
      console.log("message", payload);
    });
    getToken(messaging, {
      vapidKey:
        "BPLGsyII2RDwq37LZCst2zV17Q4xdi7AG5u4DRQKHqpco0kjYf3WsJyjZdqNEx11lI3Rl_G50_pAD51MLhkAXgE",
    })
      .then((currentToken) => {
        if (currentToken) {
          console.log( currentToken);

          // Send the token to your server and update the UI if necessary
          // ...
        } else {
          // Show permission request UI
          console.log(
            "No registration token available. Request permission to generate one."
          );
          // ...
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
        // ...
      });
  }
});

export default app;
