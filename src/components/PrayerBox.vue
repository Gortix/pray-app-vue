<template>
  <q-card
    @click="onClickHandler"
    class="row column no-wrap justify-between"
    :class="{ selected: selected, 'card-column': !props.fullSize }"
    :style="{ 'min-width': '350px' }"
  >
    <q-resize-observer @resize="(size) => (qCardSize = size)" />
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
      :class="[props.archived && 'text-blue-grey-13']"
    >
      {{ truncate(props.description) }}
    </q-card-section>
    <q-card-section class="archived" v-if="props.archived">
      {{ truncate(props.archiveDescription, 110) }}
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
import { date, QCard } from "quasar";
import { defineProps, defineEmits, ref, withDefaults, computed } from "vue";
import { Prayer } from "@/@types/database";
import { dateToString } from "@/functions/helpers";

const emits = defineEmits(["removeDoc", "update:selected", "open", "edit"]);
const showMenu = ref<boolean>(false);
const qCardSize = ref<{ width: number; height: number }>({
  width: 0,
  height: 0,
});

const props = withDefaults(
  defineProps<{
    id?: string;
    date: Date;
    description: string;
    owner: Profile;
    prayers?: Prayer[];
    archived: boolean;
    archiveDescription?: string;
    archiveDate?: Date;
    showOwner?: boolean;
    myPray: boolean;
    selectedMode: boolean;
    fullSize?: boolean;
    selected: boolean;
    adminMode: boolean;
  }>(),
  {
    archived: false,
    selected: false,
    showOwner: true,
    fullSize: false,
    archiveDescription: "",
  }
);

const convertedDate = computed(() => dateToString(props.date));
const isLast7Days = computed(() => {
  const weekAgo = date.subtractFromDate(new Date(), { days: 7 });
  const createdDate = props.date || Date.now();

  return weekAgo <= createdDate;
});
const height = computed<string>(() => {
  if (!props.archived) return "170px";
  if (qCardSize.value?.width < 440) return "250px";

  return "230px";
});

const truncate = (text: string, maxSize = 120) => {
  if (props.fullSize) {
    return text;
  }

  return text?.length > maxSize ? text.slice(0, maxSize) + "..." : text;
};

const onClickHandler = () => {
  if (props.selectedMode) {
    emits("update:selected");

    return;
  }

  emits("open", props);
};

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
  height: v-bind(height);

  &:hover {
    background-color: hsl(180, 80%, 98%);
    transform: scale(1.01) translate(-1px, -1px);
    box-shadow: $shadow-3;
  }
}
.archived {
  border: 1px solid $amber-13 !important;
  border-radius: 5px !important;
  margin: 3px 5px;
  background: linear-gradient(to bottom, $light-blue-1 10%, transparent 80%);
}
</style>
