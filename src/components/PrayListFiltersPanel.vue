<template>
  <BasicPopup posstion="bottom" v-model="showFilterMenu" title="Filtry">
    <FiltersMenu />
  </BasicPopup>
  <q-btn
    size="1.1rem"
    dense
    flat
    class="q-mr-sm"
    round
    icon="o_filter_alt"
    @click="showFilterMenu = !showFilterMenu"
  />
  <q-btn
    v-if="filterStore.date"
    dense
    size="sm"
    outline
    color="secondary"
    @click="() => (filterStore.date = '')"
  >
    {{ dataFilters[filterStore.date] }}
    <q-icon class="q-ml-xs" color="red" name="o_cancel" />
  </q-btn>
  <q-btn
    v-if="filterStore.owner"
    dense
    size="sm"
    outline
    color="amber-10"
    @click="() => (filterStore.owner = '')"
  >
    {{ store.users[filterStore.owner].name }}
    <q-icon class="q-ml-xs" color="red" name="o_cancel" />
  </q-btn>
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
