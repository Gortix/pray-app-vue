<template>

  <PrayBox v-for="rec in data"  :key="rec.date + rec.owner" v-bind="rec"/>
</template>

<script setup lang="ts">
import PrayBox from "./components/PrayBox.vue"
import { useStore } from "@/store/index";
import { computed } from "@vue/runtime-core";
import { Pray } from "./@types/database";


const store = useStore();
const data = computed<Pray[]>(() => store.data);

store.getListOfPray();
</script>
<style lang="scss">
#app{
  margin: 1.5rem;
}
</style>