import { useAuth } from "./auth";
import { Pray } from "@/@types/database";
import { date } from "quasar";


const createFilter = (name: string, filter: (el: Pray) => any, color = "") => {
  return { name, filter, color };
};

export const filters = {
  all: createFilter("Wszystkie", (el) => el),
  week: createFilter(
    "Ostatnie 7 dni",
    (el) => el.date.toDate() >= date.subtractFromDate(new Date,{days:7}),
    "green-13"
  ),
  month: createFilter(
    "Ostatnie 30 dni",
    (el) => el.date.toDate() >= date.subtractFromDate(new Date,{days:30}),
    "orange-13"
  ),
  owner: createFilter(
    "Moje modlitwy",
    (el) => {
      const auth = useAuth();
      return el.owner.id == auth.profile.id;
    },
    "light-blue-12"
  ),
};
