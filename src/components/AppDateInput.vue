<template>
  <q-input
    v-model="date"
    :rules="[(val) => datePattern.test(val)]"
    :label="props.label"
    color="primary"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="date" mask="DD.MM.YYYY">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { dateToString } from "@/functions/helpers";

const datePattern = /^[0-3]\d.[0-1]\d.[\d]{4}$/;

const props = withDefaults(
  defineProps<{ modelValue: string; label: string }>(),
  {
    modelValue: dateToString(new Date()),
  }
);
const emit = defineEmits(["update:modelValue"]);

const date = computed({
  get: () => props.modelValue,
  set: (newValue) => emit("update:modelValue", newValue),
});
</script>
