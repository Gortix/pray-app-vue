import { useStore } from "./index";
import { Pray } from "@/@types/database";
import { getOrCreateList } from "@/functions/helpers";

import { defineStore } from "pinia";

export const useSelectedList = defineStore("selectedList", {
  state: () => {
    return {
      selectedList: [] as string[],
    };
  },
  actions: {
    addOrRemoveFromList(recID: string) {
      const indexOfSelectedPray = this.selectedList.findIndex((element) => {
        return element == recID;
      });

      if (indexOfSelectedPray >= 0) {
        this.selectedList.splice(indexOfSelectedPray, 1);
        return;
      }

      this.selectedList.push(recID);
    },
    copySelectedPrays() {
      const store = useStore();

      const prayToCopy = {} as { [key: string]: Pray[] };
      const praysMap = store.getFilteredData.map(
        // eslint-disable-next-line
        //@ts-ignore
        (el, i, obj) => (obj[el["id"]] = el),
        {}
      );

      for (const recID in this.selectedList) {
        const currentPray = praysMap[recID];
        const listOfPray = getOrCreateList(currentPray.owner.id, prayToCopy);
        listOfPray.push(currentPray);
      }
      let txt = "";

      for (const k of Object.keys(prayToCopy)) {
        txt += `${prayToCopy[k][0].owner.name}: \n- ${prayToCopy[k]
          .map((el) => el.description)
          .join("\n- ")} \n`;
      }

      navigator.clipboard.writeText(txt);
    },
  },
});