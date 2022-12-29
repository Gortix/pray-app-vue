import { Pray } from "@/@types/database";

export interface PrayBoxTypes extends Pray {
  showOwner: boolean;
  myPray: boolean;
  selectedMode: boolean;
  fullSize: boolean;
  selected: boolean;
}
