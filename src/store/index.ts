import { errorLog } from "@/functions/helpers";
import { Pray, Profile } from "./../@types/database";
import { defineStore } from "pinia";
import app, { auth } from "@/@firebase";
import { filters as declaredFilters } from "./filters";
import {
  collection,
  getDocs,
  getFirestore,
  getDoc,
  updateDoc,
  Timestamp,
  addDoc,
  doc,
  deleteDoc,
  DocumentSnapshot,
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";

interface profilesMap {
  [key: string]: Profile;
}

export const db = getFirestore(app);

export const getRelatedDoc = async (path: string) => {
  const getDocResponse = await getDoc(doc(db, path));
  return { ...getDocResponse.data(), id: getDocResponse.id };
};

const createPrayObject = async (
  document: DocumentSnapshot<Pray>,
  users: profilesMap
) => {
  const docData = document.data() as Pray;
  const owner = users[docData.owner.id];

  return {
    archived: docData?.archived || true,
    date: docData?.date || Timestamp.now(),
    description: docData?.description || "",
    prayers: [],
    id: document.id,
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
        (current, previous) => previous.date.seconds - current.date.seconds
      );
    },
    getFilteredData(state) {
      // eslint-disable-next-line
      //@ts-ignore
      const currentFilterFunc = declaredFilters[state.filter]["filter"];
      // eslint-disable-next-line
      //@ts-ignore
      return state.getSortedData.filter(currentFilterFunc);
    },
    getFilters() {
      return declaredFilters;
    },
  },
  actions: {
    async getListOfPray() {
      const prayList: Pray[] = [];

      try {
        const querySnapshot = await getDocs(
          collection(db, "prayers") as CollectionReference<Pray>
        );

        for (const rec of querySnapshot.docs) {
          prayList.push(await createPrayObject(rec, this.users));
        }
        this.data = prayList;
      } catch (err) {
        console.error(err);
      }
    },
    async getListOfUsers() {
      try {
        const querySnapshot = await getDocs<Profile>(
          collection(db, "profiles") as CollectionReference<Profile>
        );

        for (const rec of querySnapshot.docs) {
          const databaseUser = rec.data();
          this.users[rec.id] = {
            id: rec.id,
            name: databaseUser.name,
          } as Profile;
        }
      } catch (err) {
        console.error(err);
      }
    },
    async addPray(owner: string, date: Date, description: string) {
      const prayObj: Pray = {
        archived: false,
        date: date ? Timestamp.fromDate(date) : Timestamp.now(),
        description: description,
        prayers: [],
        // eslint-disable-next-line
        //@ts-ignore
        owner: doc(db, "profiles/" + owner) as DocumentReference<Profile>,
      };

      try {
        const resp = await addDoc(
          collection(db, "prayers") as CollectionReference<Pray>,
          prayObj
        );

        const newPray = await getDoc<Pray>(resp);
        this.data.push(await createPrayObject(newPray, this.users));
      } catch (err) {
        console.error(err);
      }
    },
    async addProfile(userName: string) {
      try {
        const profileDoc = await addDoc(collection(db, "profiles"), {
          name: userName,
        });

        this.users[profileDoc.id] = { id: profileDoc.id, name: userName };
      } catch (err) {
        console.error(err);
      }
    },
    async removePray(prayID: string) {
      await deleteDoc(doc(db, `prayers/${prayID}`));

      const rmIndex = this.data.findIndex((rec) => rec.id == prayID);
      this.data.splice(rmIndex, 1);
    },
    async getUserProfile() {
      const resp = await getDoc(doc(db, `profiles/${auth.currentUser?.uid}`));
      return resp.data()?.name;
    },
    async updateUserProfile(name: string) {
      try {
        const docRef = doc(db, `profiles/${auth.currentUser?.uid}`);
        updateDoc(docRef, { name });
      } catch (err) {
        errorLog(err);
      }
    },
  },
});
