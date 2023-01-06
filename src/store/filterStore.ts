import { date } from "quasar";
import { Pray } from "@/@types/database";
import { defineStore } from "pinia";

export const usePrayFilter = defineStore("prayFilter", {
  state: () => {
    return {
      owner: "",
      date: "" as "" | "week" | "month",
    };
  },
  getters: {
    dateFilter() {
      if (!this.date) return (el: Pray) => el;

      const days = this.date == "week" ? 7 : 30;

      return (el: Pray): boolean =>
        el.date >= date.subtractFromDate(new Date(), { days });
    },
    ownerFilter() {
      const owner = this.owner;
      if (!owner) return (el: Pray) => el;

      return (el: Pray): boolean => {
        return el.owner.id == owner;
      };
    },
  },
  actions: {
    clear() {
      this.date = "";
      this.owner = "";
    },
  },
});
