<template>
  <BasicPopup v-model="toolbar" title="Ddaja modlitwę">
    <template #default>
      <NewPrayForm @submit="() => (toolbar = false)" />
    </template>
  </BasicPopup>
  <q-btn size="1.1rem" class="btn-fixed" round color="info" @click="() => (toolbar = true)">
    <span style="font-size: 1.4rem">&plus;</span>
  </q-btn>
</template>
<script setup lang="ts">
import { ref } from "vue";
import BasicPopup from "./BasicPopup.vue";
import NewPrayForm from "./PrayForm.vue";

const toolbar = ref(false);
</script>
<style lang="scss" scoped>
.btn-fixed {
  position: fixed;
  right: 10px;
  bottom: 10px;
}
</style>
