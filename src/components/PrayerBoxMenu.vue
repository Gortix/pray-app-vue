<template>
  <q-menu v-model="showMenu" context-menu>
    <q-list style="min-width: 200px">
      <template v-for="(itemObject, index) in itemList">
        <q-item
          v-if="itemObject.condition"
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
import { reactive, computed } from "vue";
const props = defineProps<{
  adminMode: boolean;
  myPray: boolean;
  modelValue: boolean;
  isArchived?: boolean;
}>();

const emit = defineEmits([
  "clickRemove",
  "clickSelect",
  "clickEdit",
  "clickArchive",
  "clickUnarchived",
  "update:modelValue",
]);

const itemConstructor = (
  clickEmit: () => void,
  label: string,
  condition: unknown
) => ({
  clickEmit,
  label,
  condition,
});

const admin = computed(() => props.adminMode);
const adminOrOwner = computed(() => props.adminMode || props.myPray);
const isArchived = computed(() => props.isArchived);

const itemList = reactive([
  itemConstructor(() => emit("clickSelect"), "Zaznacz", !isArchived.value),
  itemConstructor(
    () => emit("clickArchive"),
    "Dodaj świadectwo",
    adminOrOwner.value && !isArchived.value
  ),
  itemConstructor(
    () => emit("clickUnarchived"),
    "Proszę ponownie o modlitwę",
    isArchived
  ),
  itemConstructor(
    () => emit("clickEdit"),
    "Edytuj",
    adminOrOwner.value && !isArchived.value
  ),
  itemConstructor(() => emit("clickRemove"), "Usuń", admin),
]);

const showMenu = computed({
  get: () => props.modelValue,
  set: (newValue) => emit("update:modelValue", newValue),
});
</script>
