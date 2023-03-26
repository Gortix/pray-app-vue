<template>
  <q-tabs v-model="activeTab" align="justify" :active-color="color">
    <q-tab
      v-for="(tab, index) in tabs"
      :key="index"
      :name="tab.name"
      :label="tab.label"
    />
  </q-tabs>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults } from "vue";
import { LocationQueryRaw, useRouter } from "vue-router";

const props = withDefaults(defineProps<{ archived: boolean }>(), {
  archived: false,
});

const tabs = [
  {
    label: "Aktualne",
    name: "current",
    color: "light-blue-14",
  },
  {
    label: "Archiwalne",
    name: "archived",
    color: "amber-14",
  },
];

const router = useRouter();

const activeTab = computed({
  get() {
    return props.archived ? "archived" : "current";
  },
  set(tabName: string) {
    const query: LocationQueryRaw = { archived: (tabName === "archived") + "" };
    router.push({ name: "prayers", query });
  },
});

const color = computed(
  () => tabs.find((tab) => tab.name === activeTab.value)?.color
);
</script>
