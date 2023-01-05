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
import { defineStore } from "pinia";
import { Notify } from "quasar";
import { get, ref, set, update } from "firebase/database";

const provider = new GoogleAuthProvider();

setPersistence(auth, browserLocalPersistence);

export const useAuth = defineStore("auth", {
  state: () => {
    return {
      loggedIn: false,
      profile: { name: "", id: "" },
      role: "",
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
        const userRef = await get(ref(db, `users/${auth.currentUser?.uid}`));             
        const userData = userRef.val();
        this.role = userData?.role || "";

        if (!userData) await this.createUser();
        
        if (!userData?.role) {          
          Notify.create({
            message: `Twoje konto czeka na autoryzację. Napisz do Pawła lub Edyty`,
            color: "warning",
            textColor: "dark",
            position: "top",
          });
        }

        return userData?.profile || "";
      } catch (err) {
        errorLog(err);
      }
    },
    async updateUserProfile(name: string) {
      try {
        await update(ref(db, `profiles/${this.profile.id}`), { name });
        this.profile.name = name;
      } catch (err) {
        errorLog(err);
      }
    },
    async createUser() {
      // eslint-disable-next-line
      //@ts-ignore
      return await set(ref(db, "users/" + auth.currentUser?.uid), {
        name: auth.currentUser?.displayName,
        email:auth.currentUser?.email,
        profile:"",
        role: "",
      });
    },
  },
});
