import { errorLog } from "@/functions/helpers";
import { db } from "./index";
import { User } from "@/@types/database";

import { defineStore } from "pinia";
import { collection, CollectionReference, getDocs } from "firebase/firestore";

export const useAdminStore = defineStore("adminStore", {
  state: () => {
    return {
      users: [] as User[],
    };
  },
  actions: {
    async getUserList(force = false) {
      if (this.users.length > 0 && !force) {
        return;
      }
      try {
        const querySnapshot = await getDocs<User>(
          collection(db, "users") as CollectionReference<User>
        );

        for (const rec of querySnapshot.docs) {
          const databaseUser = rec.data();
          this.users.push({ ...databaseUser });
        }
      } catch (err) {
        errorLog(err);
      }
    },
  },
});
