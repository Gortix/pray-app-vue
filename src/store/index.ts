import { Pray, User } from "./../@types/database";
import { defineStore } from "pinia";
import app from "@/@firebase";
import {
  collection,
  getDocs,
  getFirestore,
  doc as firebaseDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";

const db = getFirestore(app);

// const url =
//   "https://prayer-app-dzialdowo-default-rtdb.europe-west1.firebasedatabase.app";

export const getRelatedDoc = async (path: string) => {
  const doc = await getDoc(firebaseDoc(db, path));
  return { ...doc.data(), id: doc.id };
};

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore("database", {
  state: () => {
    return {
      data: [] as Pray[],
      int: 12,
    };
  },
  getters: {
    getData(state) {
      /* eslint-disable */
      /* @ts-ignore */

      return state.data;
    },
  },
  actions: {
    async getListOfPray() {
      try {
        const prayList: Pray[] = [];

        const querySnapshot = await getDocs(collection(db, "prayers"));

        const dt = this.data;
        let it = this.int;

        for (let rec of querySnapshot.docs) {
          const docData = rec.data();
          const owner = await getRelatedDoc(docData.owner.path) as User;

          console.log(docData);
          

          prayList.push({
            archived: docData.archived,
            date: docData.date,
            description: docData.description,
            prayers: [],
            id: rec.id,
            owner,
          });
          console.log(prayList);
          
        }
        this.data = prayList;
        this.int++;

        // this.data = prayList;
        // console.log(prayList, "Tu");
      } catch (err) {
        console.log("Error");
      }
    },
    testData() {
      this.data = [
        {
          archived: false,
          date: new Timestamp(1000, 200),
          description: "kloc",
          id: "21312ff",
          prayers: [],
          owner: { id: "32d32", name: "Pa blo" },
        },
      ];
    },
  },
});
