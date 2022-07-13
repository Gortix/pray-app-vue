import { Pray } from "./../@types/database";
import { defineStore } from "pinia";
import axios from "axios";

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
      const resp = await axios.get(`${url}/data.json`);
      this.data = resp.data;
    },
  },
});
