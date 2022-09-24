<template>
  <q-card >
    <q-card-section>
      {{ description }}
    </q-card-section>

    <q-card-actions align="left">
      {{new Date(date.toDate())}}
    </q-card-actions>
    <q-card-actions align="right">
      <q-btn flat round color="light-blue" icon="fa-solid fa-hands-praying" />

    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
defineProps({
  date: Date,
  description: String,
  owner: String,
  prayers: [],
  showOwner: Boolean,
  archived: Boolean,
});
</script>
