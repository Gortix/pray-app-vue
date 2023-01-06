import { dateToString, errorLog } from "@/functions/helpers";
import { Pray, Profile } from "./../@types/database";
import { defineStore } from "pinia";
import app, { auth } from "@/@firebase";
import { filters as declaredFilters } from "./filters";
import {
  getDatabase,
  ref,
  child,
  get,
  push,
  update,
  remove,
} from "firebase/database";

interface profilesMap {
  [key: string]: Profile;
}

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
    date: new Date(year, month, day),
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
      //@ts-ignore
      const currentFilterFunc = declaredFilters[state.filter]["filter"];
      //@ts-ignore
      return state.getSortedData.filter(currentFilterFunc);
    },
    getFilters() {
      return declaredFilters;
    },
  },
  actions: {
    async getListOfPray(force = false) {
      if (this.data.length > 0 && !force) {
        return;
      }
      const prayList: Pray[] = [];

      try {
        const snapshot = await get(child(dbRef, `prayers`));
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
        
        this.data.push(await createPrayObject(keyOfNewPush, prayObj, this.users));
      } catch (err) {
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
        owner: data.owner
      };
      console.log(data.owner);
      
      try {
        // const docRef = doc(db, `prayers/${id}`);
        await update(ref(db, "prayers/"+id), prayObj );
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
        const profileKey = await push(ref(db,"profiles"),{
          name: userName,
        }).key as string;
        this.users[profileKey] = { id: profileKey, name: userName };

        return profileKey;
      } catch (err) {
        console.error(err);
        return err;
      }
    },
    async removePray(prayID: string) {
      await remove((ref(db, `prayers/${prayID}`)));

      const rmIndex = this.data.findIndex((rec) => rec.id == prayID);
      this.data.splice(rmIndex, 1);
    },
    async getUserProfile() {
      const resp = await get(child(dbRef, `profiles/${auth.currentUser?.uid}`));
      return resp.val()?.name;
    },
  },
});
