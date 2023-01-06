import { db, useStore } from "./index";
import { errorLog } from "@/functions/helpers";
import { User } from "@/@types/database";

import { defineStore } from "pinia";
import { child, get, ref, update } from "firebase/database";
import { Notify } from "quasar";

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
          const profile = store.users[currentUser.profile];
          this.users.push({ ...usersReps[id], profile, id });
        }
      } catch (err) {
        errorLog(err);
      }
    },
    async updateListOfUsers(list: User[]) {
      const updates = list.reduce((obj, el) => {
        const { id, ...rest } = el;
        for (const k of Object.keys(rest)) {
          //@ts-ignore
          obj[`${id}/${k}`] = k == "profile" ? rest[k].id : rest[k];
        }
        return obj;
      }, {});
      try {
        await update(ref(db, "/users/"), updates);
        Notify.create({
          message: `Dane zostały zmienione`,
          color: "positive",
          position: "top",
        });
      } catch (err) {
        Notify.create({
          message: `Wystąpił błąd podczas zapisu ${err}`,
          color: "negative",
          position: "top",
        });
      }
    },
  },
});
