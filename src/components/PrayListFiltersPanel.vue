<template>
  <BasicPopup posstion="bottom" v-model="showFilterMenu" title="Filtry">
    <FiltersMenu />
  </BasicPopup>
  <q-btn
    size="1.1rem"
    dense
    flat
    round
    icon="o_filter_alt"
    @click="showFilterMenu = !showFilterMenu"
  />
  <q-chip
    removable
    outline
    size="sm"
    :model-value="!!filterStore.date"
    @remove="filterStore.date = ''"
    color="secondary"
    text-color="white"
    >{{ dataFilters[filterStore.date] }}</q-chip
  >
  <q-chip
    removable
    outline
    size="sm"
    :model-value="!!filterStore.owner"
    @remove="filterStore.owner = ''"
    color="amber-10"
    text-color="white"
    >{{ store.users[filterStore.owner].name }}</q-chip
  >
</template>
<script setup lang="ts">
import { useStore } from "@/store";
import { dataFilters, usePrayFilter } from "@/store/filterStore";
import { ref } from "vue";
import BasicPopup from "./BasicPopup.vue";
import FiltersMenu from "./FiltersMenu.vue";

const filterStore = usePrayFilter();
const store = useStore();

const showFilterMenu = ref(false);
</script>
