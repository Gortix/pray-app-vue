import { date } from "quasar";
import { Pray } from "@/@types/database";
import { defineStore } from "pinia";

export const dataFilters = {
  week: "Ostatnie 7 dni",
  last30days: "Ostatnie 30 dni",
  currentMonth: "Ten miesiąc",
  previousMonth: "Poprzedni miesiąc",
};

export const ownerFIlters = {
  owner: "Właściciel",
};

export const usePrayFilter = defineStore("prayFilter", {
  state: () => {
    return {
      owner: "",
      date: "" as "" | "week" | "currentMonth" | "last30days" | "previousMonth",
    };
  },
  getters: {
    dateFilter() {
      if (!this.date) return (el: Pray) => el;
      const d = new Date();

      if (this.date == "currentMonth") {
        const compareDate = date.startOfDate(d, "month");

        return (el: Pray) => el.date >= compareDate;
      }

      if (this.date == "previousMonth") {
        let previousMonth = date.subtractFromDate(d, { months: 1 });
        previousMonth = date.startOfDate(previousMonth, "month");
        const thisMonth = date.startOfDate(d, "month");

        return (el: Pray) => el.date >= previousMonth && el.date < thisMonth;
      }

      const days = this.date == "week" ? 7 : 30;
      const compareDate = date.subtractFromDate(d, { days });
      return (el: Pray): boolean => el.date >= compareDate;
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
