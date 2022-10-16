import { DocumentReference, Timestamp } from "firebase/firestore";

export interface Prayer {
  date: string;
  person: string;
}

export interface Pray {
  id: string,
  date: Timestamp;
  description: string;
  owner: User;
  prayers: Prayer[];
  showOwner: boolean;
  archived: boolean;
}

export interface User{
    name: string,
    id: string,
}