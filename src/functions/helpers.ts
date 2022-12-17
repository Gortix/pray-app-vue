// eslint-disable-next-line
export const errorLog = (err: any) => {
  console.log(`%c${err}`, "color:red;font-size:16px");
};

export const getDataSubDays = (days: number) => {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export const getOrCreateList = (id: string, object: { [key: string]: any[] }) => {
  let myList = object[id];

  if (!myList) {
    myList = [];
    object[id] = myList;
  }

  return myList;
}
