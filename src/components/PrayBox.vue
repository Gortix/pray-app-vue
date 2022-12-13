<template>
  <q-card class="card-column" :class="{ 'selected': selected }">
    <q-card-section class="row justify-between q-pb-sm text-blue-grey-5">
      <span :class="{ 'my-pray': myPray }">
        {{ owner }}
      </span>
      <span>
        {{ convertedDate }}
      </span>
    </q-card-section>

    <q-card-section>
      {{ description }}
    </q-card-section>

    <q-card-actions class="q-pb-md q-pt-xs">
      <q-badge v-if="isLast7Days" outline color="green-13" label="Nowa" />
      <q-badge v-else outline color="white" label="&nbsp;" />
      <!-- <q-btn flat round color="light-blue" icon="fa-solid fa-hands-praying" /> -->
    </q-card-actions>
    <!-- <q-menu touch-position context-menu>
      <q-list style="min-width: 100px">
        <q-item clickable v-close-popup @click="removePrayHandler">
          <q-item-section>Usuń</q-item-section>
        </q-item>
      </q-list>
    </q-menu> -->
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
  myPray: Boolean,
  selected: { type: Boolean, default: false },
});

const convertedDate = computed(() => props.date?.toDate().toLocaleDateString());
const isLast7Days = computed(() => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const createdDate = props.date?.toDate() || Date.now();

  return weekAgo <= createdDate;
});

const removePrayHandler = () => {
  emits("removeDoc");
};
</script>
<style lang="scss" scoped>
.my-pray {
  color: $light-blue-13;
}

.selected {
  border: 2px solid $teal-14;
}
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
    transform: scale(1.01) translate(-1px, -1px);
  }

  backface-visibility: hidden;
  transition: all 0.1s;
}
</style>
