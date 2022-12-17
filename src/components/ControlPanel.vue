<template>
  <div class="panel row justify-between">
    <q-checkbox
      class="full-height"
      size="xs"
      v-model="selectAll"
      color="teal"
      label="Wszystkie"
    />
    <q-btn flat @click="emit('copy')"><q-icon name="o_content_copy" /></q-btn>
  </div>
</template>
<script setup lang="ts">
import { computed, defineEmits, defineProps } from "vue";

const emit = defineEmits(["copy", "update:select-all"]);
const props = defineProps<{ selectAll: boolean }>();

const selectAll = computed({
  get() {
    return props.selectAll;
  },
  set(val) {   
    emit("update:select-all", val);
  },
});
</script>
<style lang="scss">
.panel {
  width: 100%;
  background-color: $blue-grey-1;
  color: black;
}
</style>
