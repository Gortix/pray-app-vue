<template>
  <q-card class="card-column">
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
      <q-btn flat disable />
      <!-- <q-btn flat round color="light-blue" icon="fa-solid fa-hands-praying" /> -->
    </q-card-actions>
    <q-menu touch-position context-menu>
      <q-list style="min-width: 100px">
        <q-item clickable v-close-popup @click="removePrayHandler">
          <q-item-section>Usuń</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-card>
</template>
<script setup lang="ts">
import { Timestamp } from "@firebase/firestore";
import { computed } from "@vue/reactivity";
import { defineProps, defineEmits } from "vue";

const emits = defineEmits(["removeDoc"]);

const props = defineProps({
  date: Timestamp,
  description: String,
  owner: String,
  prayers: Array,
  showOwner: Boolean,
  archived: Boolean,
});

const convertedDate = computed(() => props.date?.toDate().toLocaleDateString());
const removePrayHandler = () => {
  emits("removeDoc");
};
</script>
<style lang="scss" scoped>
.card-column {
  flex-grow: 1;
  flex-basis: 100%;
  @media (width > $tablet) {
    flex-basis: 45%;
  }

  @media (width >= $desktop) {
    flex-basis: 30%;
  }

  &:hover {
    background-color: hsl(180, 80%, 98%);
    transform: scale(1.01);
  }

  backface-visibility: hidden;
  transition: all 0.1s;
}
</style>
