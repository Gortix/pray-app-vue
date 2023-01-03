import { db , useStore} from "./index";
import { errorLog } from "@/functions/helpers";
import { User } from "@/@types/database";

import { defineStore } from "pinia";
import { child, get, ref } from "firebase/database";

export const useAdminStore = defineStore("adminStore", {
  state: () => {
    return {
      users: [] as User[],
    };
  },
  actions: {
    async getUserList(force = false) {
      const store = useStore();
      if (this.users.length > 0 && !force) {
        return;
      }
      try {
        const snapshot = await get(child(ref(db), "users"));
        const usersReps = snapshot.val() as User[];

        for (const id in usersReps) {
          const currentUser = usersReps[id];
          //@ts-ignore
          const profile= store.users[currentUser.profile];
          this.users.push({ ...usersReps[id], profile, id });
        }
      } catch (err) {
        errorLog(err);
      }
    },
  },
});
