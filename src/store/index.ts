import { usePrayFilter } from "./filterStore";
import { dateToString } from "@/functions/helpers";
import { Pray, Profile } from "./../@types/database";
import { defineStore } from "pinia";
import app, { auth } from "@/@firebase";
import { Notify } from "quasar";
import {
  getDatabase,
  ref,
  child,
  get,
  push,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";

interface profilesMap {
  [key: string]: Profile;
}

export type Options = { label: string; value: string };

export const db = getDatabase(app);
const dbRef = ref(db);

const createPrayObject = async (
  id: string,
  docData: Pray,
  users: profilesMap
) => {
  //@ts-ignore
  const owner = users[docData.owner];
  //@ts-ignore
  const [day, month, year] = docData.date.split(".");

  return {
    archived: docData?.archived || true,
    date: new Date(year, month - 1, day),
    description: docData?.description || "",
    prayers: [],
    id,
    owner,
  };
};

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore("database", {
  state: () => {
    return {
      data: [] as Pray[],
      users: {} as profilesMap,
      filter: "all" as string,
    };
  },
  getters: {
    getSortedData(state) {
      return state.data.sort(
        (current, previous) => previous.date.getTime() - current.date.getTime()
      );
    },
    getFilteredData(state) {
      const filters = usePrayFilter();

      //@ts-ignore
      return state.getSortedData
        .filter(filters.dateFilter)
        .filter(filters.ownerFilter);
    },
    getProfileOptions() {
      const listOfUsers: Options[] = [];
      const users = this.users;

      for (const k of Object.keys(users)) {
        listOfUsers.push({ label: users[k].name, value: users[k].id });
      }

      return listOfUsers;
    },
  },
  actions: {
    async getListOfPray(force = false) {
      if (this.data.length > 0 && !force) {
        return;
      }
      const prayList: Pray[] = [];

      try {
        const snapshot = await get(
          query(
            child(dbRef, `prayers`),
            orderByChild("archived"),
            equalTo(false)
          )
        );
        const snapshotList = snapshot.val();

        for (const i in snapshotList) {
          const rec = snapshotList[i];
          prayList.push(await createPrayObject(i, rec, this.users));
        }
        this.data = prayList;
      } catch (err) {
        console.error(err);
      }
    },
    async getListOfUsers(force = false) {
      if (Object.keys(this.users).length > 0 && !force) {
        return;
      }
      try {
        const snapshot = await get(child(dbRef, `profiles`));
        const listOfProofiles: Profile[] = snapshot.val();

        for (const i in listOfProofiles) {
          const rec = listOfProofiles[i];
          this.users[i] = {
            id: i,
            name: rec.name,
          } as Profile;
        }
      } catch (err) {
        console.error(err);
      }
    },
    async addPray(owner: string, date: Date, description: string) {
      const prayObj: Pray = {
        archived: false,
        //@ts-ignore
        date: dateToString(date),
        description: description,
        prayers: [],
        //@ts-ignore
        owner,
      };

      try {
        const keyOfNewPush = push(ref(db, "prayers"), prayObj).key as string;

        this.data.push(
          await createPrayObject(keyOfNewPush, prayObj, this.users)
        );
      } catch (err) {
        Notify.create({
          message: "Błąd podczas zapisu do bazy",
          color: "negative",
          position: "top",
        });

        console.error(err);
      }
    },
    async updatePray(
      id: string,
      data: { date: Date; description: string; owner: string }
    ) {
      const prayObj: Pray = {
        //@ts-ignore
        date: dateToString(data.date),
        description: data.description,
        // @ts-ignore
        owner: data.owner,
      };

      try {
        await update(ref(db, "prayers/" + id), prayObj);
        const rec = this.data.find((rec) => rec.id == id);
        //@ts-ignore
        rec.description = data.description;
        //@ts-ignore
        rec.date = data.date;
        //@ts-ignore
        rec.owner = this.users[data.owner];
      } catch (err) {
        console.error(err);
      }
    },
    async addProfile(userName: string) {
      try {
        const profileKey = (await push(ref(db, "profiles"), {
          name: userName,
        }).key) as string;
        this.users[profileKey] = { id: profileKey, name: userName };

        return profileKey;
      } catch (err) {
        console.error(err);
        return err;
      }
    },
    async removePray(prayID: string) {
      await remove(ref(db, `prayers/${prayID}`));

      const rmIndex = this.data.findIndex((rec) => rec.id == prayID);
      this.data.splice(rmIndex, 1);
    },
    async getUserProfile() {
      const resp = await get(child(dbRef, `profiles/${auth.currentUser?.uid}`));
      return resp.val()?.name;
    },
  },
});
