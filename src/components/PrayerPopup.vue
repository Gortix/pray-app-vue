<template>
  <AppPopup v-model="toolbar" title="Ddaja modlitwę">
    <PrayerForm @submit="() => (toolbar = false)" />
  </AppPopup>
  <q-btn
    size="1.1rem"
    class="btn-fixed"
    round
    color="info"
    @click="() => (toolbar = true)"
  >
    <q-icon name="add" size="1.45em"/>
  </q-btn>
</template>
<script setup lang="ts">
import { ref } from "vue";
import AppPopup from "./AppPopup.vue";
import PrayerForm from "./PrayerForm.vue";

const toolbar = ref(false);
</script>
<style lang="scss" scoped>
.btn-fixed {
  position: fixed;
  right: 10px;
  bottom: 10px;
}
</style>
