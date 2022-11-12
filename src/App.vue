<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <PageHeader />
    </q-header>

    <q-page-container v-if="data[0]">
      <PrayBox
        v-for="rec in store.data"
        :key="rec.id"
        v-bind="rec"
        :owner="rec.owner?.name || ''"
      />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import PrayBox from "./components/PrayBox.vue";
import { useStore } from "@/store/index";
import { computed } from "@vue/runtime-core";
import PageHeader from "./components/PageHeader.vue";

const store = useStore();
store.getListOfPray();

const data = computed(() => store.data);
</script>
<style lang="scss">
#app {
  margin: 1.5rem;
}
</style>
