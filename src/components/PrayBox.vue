<template>
  <q-card class="relative-position">
    <q-card-actions class="absolute-top-left">
      {{ owner }}
    </q-card-actions>

    <q-card-section>
      {{ description }}
    </q-card-section>

    <q-card-actions class="absolute-bottom-left">
      {{ convertedDate }}
    </q-card-actions>
    <q-card-actions align="right">
      <q-btn flat round color="light-blue" icon="fa-solid fa-hands-praying" />
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
import { Timestamp } from "@firebase/firestore";
import { computed } from "@vue/reactivity";
import { defineProps } from "vue";
const props = defineProps({
  date: Timestamp,
  description: String,
  owner: String,
  prayers: [],
  showOwner: Boolean,
  archived: Boolean,
});

const convertedDate = computed(() => props.date?.toDate().toLocaleDateString());
</script>
<style lang="scss"></style>
