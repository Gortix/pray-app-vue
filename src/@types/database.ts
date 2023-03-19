export interface Prayer {
  date: string;
  person: Profile;
}

export interface Pray {
  id?: string;
  date: Date;
  description: string;
  owner: Profile;
  prayers?: Prayer[];
  archived: boolean;
  archive_description?: string;
  archive_date?: Date;
}

export interface Profile {
  name: string;
  id: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profile: Profile;
  role: "" | "user" | "admin" | "superadmin";
}
