import app from "@/@firebase";

import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import { defineStore } from "pinia";

const provider = new GoogleAuthProvider();

export const useAuth = defineStore("auth", {
  state: () => {
    return {
      user: {},
      token: "",
      loggedIn: false,
    };
  },
  actions: {
    async authorize() {
      const auth = getAuth(app);
      auth.languageCode = "pl";
      try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        this.token = credential?.accessToken || "";
        if(credential?.accessToken){
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
      const auth = getAuth();
      await signOut(auth);
    },
  },
});
