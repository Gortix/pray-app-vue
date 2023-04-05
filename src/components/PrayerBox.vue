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
      :class="[props.archived && 'text-blue-grey-13']"
    >
      {{ truncate(props.description) }}
    </q-card-section>
    <q-card-section class="archived" v-if="props.archived">
      {{ truncate(props.archive_description, 110) }}
    </q-card-section>

    <q-card-actions class="q-pb-md q-pt-xs">
      <q-badge v-if="isLast7Days" outline color="green-13" label="Nowa" />
      <q-badge v-else outline color="white" label="&nbsp;" />
      <!-- <q-btn flat round color="light-blue" icon="fa-solid fa-hands-praying" /> -->
    </q-card-actions>
    <PrayerBoxMenu
      v-model="showMenu"
      :my-pray="myPray"
      :admin-mode="adminMode"
      :is-archived="archived"
      @click-select="emit('update:selected', props)"
      @click-edit="emit('edit', props)"
      @click-archive="emit('archive', props)"
      @click-unarchived="emit('unarchive', props)"
      @click-remove="removePrayHandler"
    />
  </q-card>
</template>
<script setup lang="ts">
import { Profile } from "@/@types/database";
import { date, QCard } from "quasar";
import { ref, toRef, withDefaults, computed } from "vue";
import { Prayer } from "@/@types/database";
import { dateToString } from "@/functions/helpers";
import PrayerBoxMenu from "./PrayerBoxMenu.vue";

const emit = defineEmits([
  "removeDoc",
  "update:selected",
  "open",
  "edit",
  "archive",
  "unarchive",
]);

const props = withDefaults(
  defineProps<{
    id?: string;
    date: Date;
    description: string;
    owner: Profile;
    prayers?: Prayer[];
    archived: boolean;
    archive_description?: string;
    archive_date?: Date | string;
    showOwner?: boolean;
    myPray: boolean;
    selectedMode: boolean;
    fullSize?: boolean;
    selected: boolean;
    adminMode: boolean;
    height?: string;
  }>(),
  {
    archived: false,
    selected: false,
    showOwner: true,
    fullSize: false,
    archive_description: "",
    height: "170px",
  }
);

const showMenu = ref<boolean>(false);
const height = toRef(props, "height");

const getDate = computed(() =>
  props.archived ? (props.archive_date as Date) : props.date
);
const convertedDate = computed(() => dateToString(getDate.value));
const isLast7Days = computed(() => {
  const weekAgo = date.subtractFromDate(new Date(), { days: 7 });
  const createdDate = getDate.value || Date.now();

  return weekAgo <= createdDate;
});

const truncate = (text: string, maxSize = 120) => {
  if (props.fullSize) {
    return text;
  }

  return text?.length > maxSize ? text.slice(0, maxSize) + "..." : text;
};

const onClickHandler = () => {
  if (props.selectedMode) {
    emit("update:selected");

    return;
  }

  emit("open", props);
};

const removePrayHandler = () => {
  const test = confirm("Czy na pewno usunąc rekord?");
  if (test) {
    emit("removeDoc");
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
  background: radial-gradient( transparent 80%, $light-blue-1 130%,);
  


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
  background: linear-gradient(170deg, $light-blue-1 1%, transparent 45%) ,
  linear-gradient(320deg, $light-blue-1 1%, transparent 20%);
  box-shadow: 0px 2px 10px  $light-blue-1;
}
</style>
