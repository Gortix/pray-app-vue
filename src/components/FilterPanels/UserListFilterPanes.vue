<template>
  <q-toolbar class="row reverse">
    <q-input
      bottom-slots
      v-model="searchText"
      label="Szukaj"
      class="col col-lg-2 col-md-3 col-sm-6"
      dense
    >
      <template v-slot:append>
        <q-icon
          v-if="searchText !== ''"
          name="close"
          @click="searchText = ''"
          class="cursor-pointer"
        />
        <q-icon name="search" />
      </template>

      <template v-slot:hint> Podaj nazwę lub email </template>
    </q-input>
  </q-toolbar>
</template>
<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";

const props = defineProps({ searchText: { type: String, default: "" } });
const emit = defineEmits(["update:search-text"]);

const searchText = computed({
  get() {
    return props.searchText;
  },
  set(val) {
    emit("update:search-text", val.toLocaleLowerCase());
  },
});
</script>
