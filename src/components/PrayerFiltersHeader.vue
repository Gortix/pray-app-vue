<template>
  <AppPopup posstion="bottom" v-model="showFilterMenu" title="Filtry">
    <PrayerFiltersMenu />
  </AppPopup>
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
  >
    {{ dataFilters[filterStore.date] }}
  </q-chip>
  <q-chip
    removable
    outline
    size="sm"
    :model-value="!!filterStore.owner"
    @remove="filterStore.owner = ''"
    color="amber-10"
    text-color="white"
  >
    {{ store.users[filterStore.owner].name }}
  </q-chip>
</template>
<script setup lang="ts">
import { useStore } from "@/store";
import { dataFilters, usePrayFilter } from "@/store/filterStore";
import { ref } from "vue";
import AppPopup from "./AppPopup.vue";
import PrayerFiltersMenu from "./PrayerFiltersMenu.vue";

const filterStore = usePrayFilter();
const store = useStore();

const showFilterMenu = ref(false);
</script>
