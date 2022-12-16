// eslint-disable-next-line
export const errorLog = (err: any) => {
  console.log(`%c${err}`, "color:red;font-size:16px");
};

export const getDataSubDays = (days: number) => {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
};
