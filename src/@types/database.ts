import { DocumentReference, Timestamp } from "firebase/firestore";

export interface Prayer {
  date: string;
  person: string;
}

export interface Pray {
  id?: string,
  date: Timestamp;
  description: string;
  owner:  Profile ;
  prayers?: Prayer[];
  archived: boolean;
}

export interface Profile{
    name: string,
    id: string,
}

export interface User{
  profile: DocumentReference<Profile>,
  role: 'user' | 'admin' | 'superadmin',
}

