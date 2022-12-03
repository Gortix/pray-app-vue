<template>
  <q-dialog
    :model-value="props.modelValue"
    @show="emit('update:modelValue', true)"
    @hide="emit('update:modelValue', false)"
  >
    <q-card class="width">
      <q-toolbar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
        </q-avatar>

        <q-toolbar-title>{{ title }}</q-toolbar-title>

        <q-btn flat round icon="close" dense v-close-popup />
      </q-toolbar>

      <q-card-section>
        <slot name="default"></slot>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({ modelValue: Boolean, title: String });
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
