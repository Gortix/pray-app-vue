import { Pray } from "@/@types/database";
import { date as quasarDate } from "quasar";

export const errorLog = (err: unknown) => {
  console.log(`%c${err}`, "color:red;font-size:16px");
};

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

export const stringTodate = (date: string) => {
  return date.split(".").reverse().join(".");
};

export const getTime = (value: Date | string | undefined) => {
  return typeof value === "string"
    ? new Date(stringTodate(value)).getTime()
    : value?.getTime() ?? 0;
};

export const sortPrayByTime = (
  data: Pray[],
  fieldName: "date" | "archive_date"
) =>
  [...data].sort(
    (current, previous) =>
      getTime(previous[fieldName]) - getTime(current[fieldName])
  );
