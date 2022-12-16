// eslint-disable-next-line
export const errorLog = (err: any) => {
  console.log(`%c${err}`, "color:red;font-size:16px");
};

export const getOrCreateList = (id: string, object: { [key: string]: any[] }) => {
  let myList = object[id];

  if (!myList) {
    myList = [];
    object[id] = myList;
  }

  return myList;
};
