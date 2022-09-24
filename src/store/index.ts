import { Pray } from "./../@types/database";
import { defineStore } from "pinia";
import app from "@/@firebase";
import {
  collection,
  CollectionReference,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import axios from "axios";

const db = getFirestore(app);

const url =
  "https://prayer-app-dzialdowo-default-rtdb.europe-west1.firebasedatabase.app";

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore("database", {
  state: () => ({
    data: [{}] as Pray[],
  }),
  actions: {
    async getListOfPray() {
      const prayList: Pray[] = [];

      const querySnapshot = await getDocs(
        collection(db, "prayers") as CollectionReference<Pray>
      );

      querySnapshot.forEach((doc) => {
        prayList.push({...doc.data(), id: doc.id });
      });

      this.data = prayList;
    },
  },
});
