import { date } from "quasar";
import { defineStore } from "pinia";
import { Pray } from "@/@types/database";
import { usePageState } from "@/store/pageState";

export type dateType =
  | ""
  | "week"
  | "currentMonth"
  | "last30days"
  | "previousMonth";

//@ts-ignore
export const dataFilters: { [key in dateType]: string } = {
  week: "Ostatnie 7 dni",
  last30days: "Ostatnie 30 dni",
  currentMonth: "Ten miesiąc",
  previousMonth: "Poprzedni miesiąc",
};

export const ownerFIlters = {
  owner: "Właściciel",
};

const d = new Date();
const thisMonth = date.startOfDate(d, "month");

export const usePrayFilter = defineStore("prayFilter", {
  state: () => {
    return {
      owner: "",
      date: "" as dateType,
      archived: false,
    };
  },
  getters: {
    dateFilter() {
      const pageState = usePageState();
      const dateField = pageState.archived ? "archive_date" : "date";

      if (!this.date) return (el: Pray) => el;

      if (this.date == "currentMonth") {
        const compareDate = date.startOfDate(d, "month");

        return (el: Pray) => (el[dateField] ?? 0) >= compareDate;
      }

      if (this.date == "previousMonth") {
        let previousMonth = date.subtractFromDate(d, { months: 1 });
        previousMonth = date.startOfDate(previousMonth, "month");

        return (el: Pray) =>
          (el[dateField] ?? 0) >= previousMonth &&
          (el[dateField] ?? 0) < thisMonth;
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
    archivedFilter() {
      return (el: Pray): boolean => el.archived == this.archived;
    },
  },
  actions: {
    clear() {
      this.date = "";
      this.owner = "";
    },
  },
});
