<template>
  <q-card class="column">
    <q-card-section class="row justify-between q-pb-sm text-blue-grey-5">
      <span>
        {{ owner }}
      </span>
      <span>
        {{ convertedDate }}
      </span>
    </q-card-section>

    <q-card-section>
      {{ description }}
    </q-card-section>

    <q-card-actions class="row justify-end">
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
  prayers: Array,
  showOwner: Boolean,
  archived: Boolean,
});

const convertedDate = computed(() => props.date?.toDate().toLocaleDateString());
</script>
<style lang="scss"></style>
