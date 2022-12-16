<template>
  <q-scroll-area class="fit">
    <q-list padding class="menu-list">
      <q-item
        clickable
        @click="() => selectedFilter(value.filter)"
        :key="key"
        v-ripple
        v-for="(value, key) in filters"
      >
        <q-item-section :class="[`text-${value.color}`]">
          {{ value.name }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>
<script setup lang="ts">
import { Pray } from "@/@types/database";
import { getDataSubDays } from "@/functions/helpers";
import { useAuth } from "@/store/auth";
import { ref, defineEmits } from "vue";

const auth = useAuth();

const createFilter = (
  name: string,
  filter: (el: Pray) => any,
  color = ""
) => {
  return { name, filter, color };
};

const filters = ref({
  all: createFilter("Wszystkie", (el) => el),
  week: createFilter(
    "Ostatnie 7 dni",
    (el) => el.date.toDate() >= getDataSubDays(7),
    "green-13"
  ),
  month: createFilter(
    "Ostatnie 30 dni",
    (el) => el.date.toDate() >= getDataSubDays(30),
    "orange-13"
  ),
  owner: createFilter(
    "Moje modlitwy",
    (el) => el.owner.id == auth.profile.id,
    "light-blue-12"
  ),
});

const emit = defineEmits(["selected"]);

const selectedFilter = (func: (el: Pray) => any) => {
  emit("selected", func);
};
</script>
