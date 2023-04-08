import { defineStore } from "pinia";

export const usePageState = defineStore("pageState", {
  state: () => {
    return {
      searchText: "",
      archived: false,
    };
  },
  getters: {
    searchTextLower(state) {
      return state.searchText.trim().toLowerCase();
    },
  },
  actions: {
    updateSearchText(text: string) {
      this.searchText = text;
    },
    async updateArchived(archived: boolean) {
      this.archived = archived;
    },
  },
});
