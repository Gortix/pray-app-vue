<template>
  <q-scroll-area class="fit">
    <q-list padding class="menu-list">
      <q-item
        clickable
        :key="key"
        v-ripple
        @click="() => (store.filter = key)"
        v-for="(value, key) in store.getFilters"
      >
        <q-item-section :class="[`text-${value.color}`]">
          {{ value.name }}
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="filterStore.clear"> Wyczyść </q-item>
      <q-item clickable v-ripple @click="() => (filterStore.date = 'week')">
        Ostatni tydzień
      </q-item>
      <q-item clickable v-ripple @click="() => (filterStore.date = 'month')">
        Ostatni Miesiąc
      </q-item>
      <q-item
        clickable
        v-ripple
        @click="() => (filterStore.owner = auth.profile.id)"
      >
        Moje
      </q-item>
    </q-list>
  </q-scroll-area>
</template>
<script setup lang="ts">
import { useStore } from "@/store/index";
import { usePrayFilter } from "@/store/filterStore";
import { useAuth } from "@/store/auth";

const store = useStore();
const filterStore = usePrayFilter();
const auth = useAuth();
</script>
