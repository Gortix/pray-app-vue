import { DocumentReference, Timestamp } from "firebase/firestore";

export interface Prayer {
  date: string;
  person: Profile;
}

export interface Pray {
  id?: string;
  date: Timestamp;
  description: string;
  owner: Profile;
  prayers?: Prayer[];
  archived: boolean;
}

export interface Profile {
  name: string;
  id: string;
}

export interface User {
  id: string;
  name: string;
  profile: DocumentReference<Profile>;
  role: "" | "user" | "admin" | "superadmin";
}
