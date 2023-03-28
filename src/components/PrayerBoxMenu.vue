<template>
  <q-menu v-model="showMenu" context-menu>
    <q-list style="min-width: 200px">
      <template v-for="(itemObject, index) in itemList">
        <q-item
          v-if="condition(itemObject.condition)"
          :key="index"
          clickable
          v-close-popup
          @click="itemObject.clickEmit"
        >
          <q-item-section>{{ itemObject.label }}</q-item-section>
        </q-item>
      </template>
    </q-list>
  </q-menu>
</template>
<script setup lang="ts">
import { computed } from "vue";

const itemConstructor = (
  clickEmit: () => void,
  label: string,
  condition: "adminOrOwner" | "admin" | "all" = "all"
) => ({
  clickEmit,
  label,
  condition,
});

const itemList = [
  itemConstructor(() => emit("clickSelect"), "Zaznacz"),
  itemConstructor(
    () => emit("clickArchive"),
    "Dodaj świadectwo",
    "adminOrOwner"
  ),
  itemConstructor(() => emit("clickEdit"), "Edytuj", "adminOrOwner"),
  itemConstructor(() => emit("clickRemove"), "Usuń", "admin"),
];

const props = defineProps<{
  adminMode: boolean;
  myPray: boolean;
  modelValue: boolean;
}>();
const emit = defineEmits([
  "clickRemove",
  "clickSelect",
  "clickEdit",
  "clickArchive",
  "update:modelValue",
]);

const condition = computed(() => (value: string) => {
  if (value == "admin") return props.adminMode;
  if (value == "adminOrOwner") return props.adminMode || props.myPray;
  return true;
});

const showMenu = computed({
  get: () => props.modelValue,
  set: (newValue) => emit("update:modelValue", newValue),
});
</script>
