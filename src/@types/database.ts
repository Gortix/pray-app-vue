export interface Prayer {
  date: string;
  person: Profile;
}

export interface Pray extends ArchivePrayer {
  id: string;
  date: Date;
  description: string;
  owner: Profile;
  prayers?: Prayer[];
}

export interface ArchivePrayer {
  archived: boolean;
  archive_description?: string;
  archive_date?: Date | string;
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
