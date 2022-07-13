
export interface Prayer {
  date: string;
  person: string;
}

export interface Pray {
  date: string;
  description: string;
  owner: string;
  prayers: Prayer[];
  showOwner: boolean;
  archived: boolean;
}

export interface User{
    name: string,
    id: string,
}