<template>
  <Teleport to="body">
    <BasicPopup v-model="toolbar" title="Ddaja modlitwę">
      <template #default>
        <NewPrayForm @submit="() => (toolbar = false)" />
      </template>
    </BasicPopup>
  </Teleport>
  <q-btn class="btn-fixed" round color="info" @click="() => (toolbar = true)">
    <span style="font-size: 1.3rem">&plus;</span>
  </q-btn>
</template>
<script setup lang="ts">
import { ref } from "vue";
import BasicPopup from "./BasicPopup.vue";
import NewPrayForm from "./NewPrayForm.vue";

const toolbar = ref(false);
</script>
<style lang="scss" scoped>
.btn-fixed {
  position: fixed;
  right: 10px;
  bottom: 10px;
}
</style>
