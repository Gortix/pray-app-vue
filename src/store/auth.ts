import { db } from "./index";
import { auth } from "@/@firebase";
import { errorLog } from "@/functions/helpers";

import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { doc, updateDoc, DocumentReference, getDoc } from "firebase/firestore";

import { defineStore } from "pinia";
import { User } from "@/@types/database";

const provider = new GoogleAuthProvider();

setPersistence(auth, browserLocalPersistence);

export const useAuth = defineStore("auth", {
  state: () => {
    return {
      loggedIn: false,
      profile: { name: "", id: "" },
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
        // eslint-disable-next-line
      } catch (error: any) {
        // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      }
    },
    async singOut() {
      await signOut(auth);
    },
    async getUserProfileID() {
      try {
        const userRef = doc(
          db,
          `users/${auth.currentUser?.uid}`
        ) as DocumentReference<User>;
        const getUserResponse = await getDoc(userRef);
        
        return getUserResponse.data()?.profile.id;
      } catch (err) {
        errorLog(err);
      }
    },
    async updateUserProfile(name: string) {
      try {
        const docRef = doc(db, `profiles/${this.profile.id}`);
        try {
          await updateDoc(docRef, { name });
          this.profile.name = name;
        } catch (err) {
          errorLog(err);
        }
      } catch (err) {
        errorLog(err);
      }
    },
  },
});
