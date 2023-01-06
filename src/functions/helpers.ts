import { Pray } from "@/@types/database";
import { date as quasarDate } from "quasar";

// @ts-ignore
export const errorLog = (err: any) => {
  console.log(`%c${err}`, "color:red;font-size:16px");
};

// @ts-ignore
export const getOrCreateList = (
  id: string,
  object: { [key: string]: Pray[] }
) => {
  let myList = object[id];

  if (!myList) {
    myList = [];
    object[id] = myList;
  }

  return myList;
};

export const dateToString = (date: Date) => {
  return quasarDate.formatDate(date, "DD.MM.YYYY");
};
