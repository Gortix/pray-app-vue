<template>
  <q-card-actions vertical>
    <q-btn clickable v-ripple @click="filterStore.clear"> Wszystkie </q-btn>
  </q-card-actions>
  <q-separator />
  <q-item-label header>Data</q-item-label>
  <q-card-actions vertical>
    <q-btn
      v-for="(value, key) in dataFilters"
      :key="key"
      :color="filterStore.date == key ? 'secondary' : 'white'"
      text-color="black"
      clickable
      v-ripple
      @click="dateSelect(key)"
    >
      {{ value }}
    </q-btn>
  </q-card-actions>
  <q-separator />
  <q-item-label header>Właściciel</q-item-label>
  <q-card-actions vertical>
    <q-btn
      :color="iAmOwner ? 'amber' : 'white'"
      text-color="black"
      clickable
      v-ripple
      @click="ownerSelect"
    >
      Moje
    </q-btn>
    <q-select
      clearable
      v-model="user"
      :options="options"
      popup-content-class="dropdown-popup"
      behavior="menu"
      emit-value
      map-options
      use-input
      @filter="selectFilter"
      label="Właściciel"
    />
  </q-card-actions>
</template>
<script setup lang="ts">
import { usePrayFilter, dataFilters, dateType } from "@/store/filterStore";
import { useAuth } from "@/store/auth";
import { useStore } from "@/store/index";
import { ref, computed } from "vue";

const filterStore = usePrayFilter();
const auth = useAuth();
const store = useStore();
const filterValue = ref("");

const iAmOwner = computed(() => filterStore.owner == auth.profile.id);
const user = computed({
  get() {
    return filterStore.owner;
  },
  set(value) {
    filterStore.owner = value;
  },
});
const options = computed(() => {
  if (!filterValue.value) return store.getProfileOptions;

  return store.getProfileOptions.filter((el) =>
    el.label.toLowerCase().includes(filterValue.value)
  );
});

const ownerSelect = () => {
  if (iAmOwner.value) return (filterStore.owner = "");

  return (filterStore.owner = auth.profile.id);
};

const dateSelect = (key: dateType) => {
  if (filterStore.date == key) return (filterStore.date = "");

  return (filterStore.date = key);
};

const selectFilter = (val: string, update: (fn: () => void) => void) => {
  update(() => {
    filterValue.value = val.toLowerCase();
  });
};
</script>
<style lang="scss">
.dropdown-popup {
  border-left: 4px solid $light-blue-11;
}
</style>
