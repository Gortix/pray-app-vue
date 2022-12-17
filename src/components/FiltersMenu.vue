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
    </q-list>
  </q-scroll-area>
</template>
<script setup lang="ts">
import { useStore } from "@/store/index";

const store = useStore();
</script>
