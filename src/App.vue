<template>
  <PrayBox
    v-for="rec in data"
    :key="rec.id"
    v-bind="rec"
    :owner="rec.owner.name"
  />
</template>

<script setup lang="ts">
import PrayBox from "./components/PrayBox.vue"
import { getRelatedDoc, useStore } from "@/store/index";
import { computed } from "@vue/runtime-core";
import { Pray } from "./@types/database";



const store = useStore();
const data = computed<Pray[]>(() => store.data);

store.getListOfPray();
</script>
<style lang="scss">
#app {
  margin: 1.5rem;
}
</style>
