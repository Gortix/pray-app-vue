<template>
  <q-card
    @click="
      () => {
        if (props.selectedMode) {
          emits('update:selected');
          return;
        }
        fullSize = !fullSize;
      }
    "
    class="row column no-wrap justify-between card-column"
    :style="{ height: props.fullSize ? 'none' : '170px', 'min-width': '350px' }"
    :class="{ selected: selected, cardColumn: !props.fullSize }"
  >
    <q-card-section class="row justify-between q-pb-sm text-blue-grey-5">
      <span :class="{ 'my-pray': myPray }">
        {{ owner }}
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
    <q-menu v-model="showMenu" context-menu :offset="[50, 30]">
      <q-list style="min-width: 200px">
        <q-item clickable v-close-popup @click="emits('update:selected')">
          <q-item-section>Zaznacz</q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="removePrayHandler">
          <q-item-section>Usuń</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-card>
  <q-dialog v-model="fullSize" auto-close>
    <PrayBox v-bind="{ ...props, fullSize: true }" />
  </q-dialog>
</template>
<script setup lang="ts">
import { Details } from "@/@types/quasar";
import { Timestamp } from "@firebase/firestore";
import { computed } from "@vue/reactivity";
import { date } from "quasar";
import { defineProps, defineEmits, ref } from "vue";

const emits = defineEmits(["removeDoc", "update:selected"]);
const fullSize = ref<boolean>(false);
const showMenu = ref<boolean>(false);

const props = defineProps({
  date: Timestamp,
  description: String,
  owner: String,
  prayers: Array,
  showOwner: Boolean,
  archived: Boolean,
  myPray: Boolean,
  selectedMode: Boolean,
  maxSize: { type: Number, default: 120 },
  fullSize: { type: Boolean, default: false },
  selected: { type: Boolean, default: false },
});

const convertedDate = computed(() => props.date?.toDate().toLocaleDateString());
const isLast7Days = computed(() => {
  const weekAgo = date.subtractFromDate(new Date(), { days: 7 });
  const createdDate = props.date?.toDate() || Date.now();

  return weekAgo <= createdDate;
});

const touchEvent = (ev: Details) => {
  if (ev.duration > 1000) showMenu.value = true;
};

const truncateDescription = computed(() => {
  const desc = props.description as string;

  if (props.fullSize) {
    return desc;
  }

  return desc?.length > props.maxSize
    ? desc.slice(0, props.maxSize) + "..."
    : desc;
});
// const fullSize = () => {
//    // eslint-disable-next-line
//   //@ts-ignore
//   cardEl.value.style = {};
//   // eslint-disable-next-line
//   //@ts-ignore
//   cardEl.value.style.height = "100vh";
//   // eslint-disable-next-line
//   //@ts-ignore
//   cardEl.value.style.width = "100vw";
//   console.log(cardEl.value);

// };

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
  // flex-grow: 1;
  // flex-basis: 100%;
  border: 2px solid white;
  transition: all 0.3s;

  // @media (width > $tablet) {
  //   flex-basis: 48%;
  // }

  // @media (width >= $desktop) {
  //   flex-basis: 32%;
  // }

  &:hover {
    background-color: hsl(180, 80%, 98%);
    transform: scale(1.01) translate(-1px, -1px);
    box-shadow: $shadow-3;
  }
}
</style>
