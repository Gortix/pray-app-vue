import { Pray } from "./../@types/database";
import { defineStore } from "pinia";
import app from "@/@firebase";
import {
  collection,
  CollectionReference,
  getDocs,
  getFirestore,
  doc as firebaseDoc,
  getDoc,
} from "firebase/firestore";
import axios from "axios";
import { async } from "@firebase/util";

const db = getFirestore(app);

const url =
  "https://prayer-app-dzialdowo-default-rtdb.europe-west1.firebasedatabase.app";

export const getRelatedDoc = async (path: string) => {
  const doc = await getDoc(firebaseDoc(db, path));
  return { ...doc.data(), id: doc.id };
};

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore("database", {
  state: () => ({
    data: [{}] as Pray[],
  }),
  actions: {
    async getListOfPray() {
      const prayList: Pray[] = [];

      const querySnapshot = await getDocs(collection(db, "prayers"));

      querySnapshot.forEach(async (doc) => {
        const data = doc.data();
        const owner = await getRelatedDoc(data.owner.path);

        prayList.push({ ...data, id: doc.id, owner } as Pray);
      });

      this.data = prayList;
    },
  },
});
