import { usePrayFilter } from "./filterStore";
import { dateToString } from "@/functions/helpers";
import { ArchivePrayer, Pray, Profile } from "./../@types/database";
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
  let archiveDate;
  //@ts-ignore
  const owner = users[docData.owner];
  //@ts-ignore
  const [day, month, year] = docData.date.split(".");

  if (docData.archive_date) {
    //@ts-ignore
    const [day, month, year] = docData.archive_date.split(".");
    archiveDate = new Date(year, month - 1, day);
  }

  return {
    archived: docData?.archived || false,
    date: new Date(year, month - 1, day),
    description: docData?.description || "",
    prayers: [],
    id,
    owner,
    archive_description: docData.archive_description || "",
    archiveDate,
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
      archivedPulled: false,
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
        .filter(filters.ownerFilter)
        .filter(filters.archivedFilter);
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
    async getListOfPray(archived = false, force = false) {
      if (
        !force &&
        ((!archived && this.data.length > 0) ||
          (archived && this.archivedPulled))
      )
        return;

      if (archived) {
        this.archivedPulled = archived;
      }

      const prayList: Pray[] = [];

      try {
        const snapshot = await get(
          query(
            child(dbRef, `prayers`),
            orderByChild("archived"),
            equalTo(archived)
          )
        );
        const snapshotList = snapshot.val();

        for (const i in snapshotList) {
          const rec = snapshotList[i];
          prayList.push(await createPrayObject(i, rec, this.users));
        }

        this.data.push(...prayList);
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

        return this.data.push(
          await createPrayObject(keyOfNewPush, prayObj, this.users)
        );
      } catch (err) {
        Notify.create({
          message: "Błąd podczas zapisu do bazy",
          color: "negative",
          position: "top",
        });

        console.error(err);

        throw err;
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
        if (!rec) return console.error(rec);

        rec.description = data.description;
        rec.date = data.date;
        rec.owner = this.users[data.owner];
      } catch (err) {
        console.error(err);
      }
    },
    async archivePrayer(
      id: string,
      data: {
        archive_date?: Date;
        archive_description?: string;
        archived?: boolean;
      }
    ) {
      if (typeof data.archived == "undefined") {
        data.archived = true;
      }

      const prayObj: ArchivePrayer = {
        archived: data.archived,
      };

      if (data.archive_date && data.archive_description) {
        prayObj.archive_date = dateToString(data.archive_date);
        prayObj.archive_description = data.archive_description;
      }

      try {
        await update(ref(db, "prayers/" + id), prayObj);
        const rec = this.data.find((rec) => rec.id == id);

        if (!rec) return console.error(rec);

        rec.archive_description = data.archive_description;
        rec.archive_date = data.archive_date;
        rec.archived = data.archived;
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
