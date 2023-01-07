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
      @click="() => (filterStore.date = key)"
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
      @click="() => (filterStore.owner = auth.profile.id)"
    >
      Moje
    </q-btn>
    <q-select
      clearable
      v-model="user"
      :options="store.getProfileOptions"
      emit-value
      map-options
      label="Właściciel"
    />
  </q-card-actions>
</template>
<script setup lang="ts">
import { usePrayFilter, dataFilters } from "@/store/filterStore";
import { useAuth } from "@/store/auth";
import { useStore } from "@/store/index";
import { computed, ref } from "vue";

const filterStore = usePrayFilter();
const auth = useAuth();
const store = useStore();
const iAmOwner = computed(() => (filterStore.owner == auth.profile.id));

const user = computed({
  get() {
    return filterStore.owner;
  },
  set(value) {
    filterStore.owner = value;
  },
});
</script>
