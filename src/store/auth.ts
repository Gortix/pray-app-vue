import { auth } from "@/@firebase";

import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { defineStore } from "pinia";

const provider = new GoogleAuthProvider();

setPersistence(auth, browserLocalPersistence);

export const useAuth = defineStore("auth", {
  state: () => {
    return {
      loggedIn: false,
    };
  },
  actions: {
    async authorize() {
      try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          this.loggedIn = true;
        }
        // The signed-in user info.
        // this.user = await result;
      } catch (error: any) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      }
    },
    async singOut() {
      await signOut(auth);
    },
  },
});
