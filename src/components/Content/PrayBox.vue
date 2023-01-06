<template>
  <q-card
    @click="onClickHandler"
    class="row column no-wrap justify-between"
    :class="{ selected: selected, 'card-column': !props.fullSize }"
    :style="{ 'min-width': '350px' }"
  >
    <q-card-section class="row justify-between q-pb-sm text-blue-grey-5">
      <span :class="{ 'my-pray': myPray }">
        {{ owner.name }}
      </span>
      <span>
        {{ convertedDate }}
      </span>
    </q-card-section>
    <q-card-section
      :style="{ overflow: props.fullSize ? 'visible' : 'hidden' }"
    >
      {{ truncateDescription }}
    </q-card-section>

    <q-card-actions class="q-pb-md q-pt-xs">
      <q-badge v-if="isLast7Days" outline color="green-13" label="Nowa" />
      <q-badge v-else outline color="white" label="&nbsp;" />
      <!-- <q-btn flat round color="light-blue" icon="fa-solid fa-hands-praying" /> -->
    </q-card-actions>
    <q-menu v-model="showMenu" context-menu>
      <q-list style="min-width: 200px">
        <q-item clickable v-close-popup @click="emits('update:selected')">
          <q-item-section>Zaznacz</q-item-section>
        </q-item>
        <q-item
          v-if="myPray || adminMode"
          clickable
          v-close-popup
          @click="emits('edit', props)"
        >
          <q-item-section>Edytuj</q-item-section>
        </q-item>
        <q-item
          v-if="adminMode"
          clickable
          v-close-popup
          @click="removePrayHandler"
        >
          <q-item-section>Usuń</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-card>
</template>
<script setup lang="ts">
import { Profile } from "@/@types/database";
import { computed } from "@vue/reactivity";
import { date } from "quasar";
import { defineProps, defineEmits, ref, withDefaults } from "vue";
import { Prayer } from "@/@types/database";

const emits = defineEmits(["removeDoc", "update:selected", "open", "edit"]);
const showMenu = ref<boolean>(false);

const props = withDefaults(
  defineProps<{
    id?: string;
    date: Date;
    description: string;
    owner: Profile;
    prayers?: Prayer[];
    archived: boolean;
    showOwner?: boolean;
    myPray: boolean;
    selectedMode: boolean;
    fullSize?: boolean;
    selected: boolean;
    adminMode: boolean;
  }>(),
  { archived: false, selected: false, showOwner: true, fullSize: false }
);

const convertedDate = computed(() => props.date.toLocaleDateString());
const isLast7Days = computed(() => {
  const weekAgo = date.subtractFromDate(new Date(), { days: 7 });
  const createdDate = props.date || Date.now();

  return weekAgo <= createdDate;
});

const onClickHandler = () => {
  if (props.selectedMode) {
    emits("update:selected");
    return;
  }

  emits("open", props);
};

const truncateDescription = computed(() => {
  const maxSize = 120;
  const desc = props.description as string;

  if (props.fullSize) {
    return desc;
  }

  return desc?.length > maxSize ? desc.slice(0, maxSize) + "..." : desc;
});

const removePrayHandler = () => {
  const test = confirm("Czy na pewno usunąc rekord?");
  if (test) {
    emits("removeDoc");
  }
};
</script>
<style lang="scss" scoped>
.my-pray {
  color: $light-blue-13;
}
.selected {
  border: 2px solid $teal-14 !important;
}
.card-column {
  border: 2px solid white;
  transition: all 0.3s;
  min-width: 350px;
  height: 170px;

  &:hover {
    background-color: hsl(180, 80%, 98%);
    transform: scale(1.01) translate(-1px, -1px);
    box-shadow: $shadow-3;
  }
}
</style>
