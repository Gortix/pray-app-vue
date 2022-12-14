<template>
  <div class="panel">
    <q-checkbox class="full-height" size="xs" v-model="color" color="teal" label="Wszystkie" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const color = ref(false);
</script>
<style lang="scss">
.panel {
  width: 100%;
  background-color: $blue-grey-1;
  color: black;
}
</style>
