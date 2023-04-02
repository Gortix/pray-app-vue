import { useStore } from "./index";
import { Pray } from "@/@types/database";
import { getOrCreateList } from "@/functions/helpers";
import { Notify } from "quasar";

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
    async copySelectedPrays() {
      const store = useStore();

      const prayToCopy = {} as { [key: string]: Pray[] };
      const praysMap = [...store.getFilteredData].map(
        //@ts-ignore
        (el, i, obj) => (obj[el["id"]] = el),
        {}
      );

      for (const recID of this.selectedList) {
        const currentPray = { ...praysMap.find((el) => el.id == recID) };
        if (currentPray.owner) {
          const listOfPray = getOrCreateList(currentPray.owner.id, prayToCopy);
          //@ts-ignore
          listOfPray.push(currentPray);
        }
      }
      let txt = "";

      for (const k of Object.keys(prayToCopy)) {
        txt += `${prayToCopy[k][0].owner.name}: \n- ${prayToCopy[k]
          .map((el) => el.description)
          .join("\n- ")} \n`;
      }
      try {
        await navigator.clipboard.writeText(txt);
        Notify.create({
          message: `Modlitwy skopiowane`,
          color: "info",
          textColor: "white",
          position: "top",
        });
      } catch (err) {
        Notify.create({
          message: `Kopiowanie nie powiodło się ${err}`,
          color: "negative",
          textColor: "white",
          position: "top",
          multiLine: true,
        });
      }
    },
  },
});
