<template>
  <Teleport to="body">
    <q-dialog
      :position="props.posstion"
      :model-value="props.modelValue"
      @show="emit('update:modelValue', true)"
      @hide="emit('update:modelValue', false)"
    >
      <q-card class="width">
        <q-toolbar>
          <q-toolbar-title>{{ title }}</q-toolbar-title>

          <q-btn flat round icon="close" dense v-close-popup />
        </q-toolbar>

        <q-card-section>
          <slot name="default"></slot>
        </q-card-section>
      </q-card>
    </q-dialog>
  </Teleport>
</template>
<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  posstion?: "standard" | "top" | "right" | "bottom" | "left" | undefined;
  modelValue: boolean;
  title: string;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): boolean;
}>();
</script>
<style lang="scss" scoped>
.width {
  width: 100vw;
  @media (width> $desktop) {
    width: 60vw;
  }
}
</style>
