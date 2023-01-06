<template>
  <div class="panel row justify-between">
    <q-checkbox
      class="full-height"
      size="xs"
      :model-value="selectAll"
      @update:model-value="updateSelectAll"
      color="teal"
      label="Wszystkie"
    />
    <q-btn flat @click="() => selectedListStore.copySelectedPrays()">
      <q-icon name="o_content_copy" />
    </q-btn>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useSelectedList } from "@/store/selectedList";
import { useStore } from "@/store/index";

const selectedListStore = useSelectedList();
const store = useStore();

const selectAll = ref(false);

const selectedList = computed(() => selectedListStore.selectedList);
const data = computed(() => store.getFilteredData);

const updateSelectAll = (val: boolean) => {
  selectAll.value = val;

  if (!val) {
    selectedListStore.selectedList = [];
  }
};

watch(
  () => selectedList.value.length,
  (len) => {
    selectAll.value = len == data.value.length;
  }
);

watch(selectAll, (val) => {
  if (val) {
    for (let { id } of data.value) {
      if (!selectedList.value.includes(id as string)) {
        selectedList.value.push(id as string);
      }
    }
  }
});
</script>
<style lang="scss">
.panel {
  width: 100%;
  background-color: $blue-grey-1;
  color: black;
}
</style>
