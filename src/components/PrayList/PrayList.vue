<template>
  <TransitionGroup
    name="pray-box-list"
    class="row wrap q-mt-sm justify-center custom-gap render-list items-stretch"
    tag="ul"
  >
    <li class="card-column-1" v-for="rec in data" :key="rec.id">
      <PrayBox
        v-bind="convertDataForPrayBox(rec)"
        @remove-doc="() => store.removePray(rec.id as string)"
        @update:selected="() => slStore.addOrRemoveFromList(rec.id)"
      />
    </li>
  </TransitionGroup>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/store/index";
import { useAuth } from "@/store/auth";
import { useSelectedList } from "@/store/selectedList";
import PrayBox from "./PrayBox.vue";

const store = useStore();
const auth = useAuth();
const slStore = useSelectedList();

const data = computed(() => store.getFilteredData);
const selectedList = computed(() => slStore.selectedList);

const isSelected = (recID: string) => {
  return selectedList.value.findIndex((el) => el == recID) >= 0;
};

const convertDataForPrayBox = (data: {
  id: string;
  owner: { id: string; name: string };
  myPray: boolean;
  selected: boolean;
}) => {
  const convData = {
    ...data,
    owner: data.owner.name,
    myPray: data.owner.id == auth.profile.id,
    selected: isSelected(data.id as string),
    selectedMode: slStore.selectedList.length > 0,
  };

  return convData;
};
</script>
<style lang="scss">
.pray-box-list-move, /* apply transition to moving elements */
.pray-box-list-enter-active,
.pray-box-list-leave-active {
  transition: all 0.5s ease;
}

.pray-box-list-enter-from,
.pray-box-list-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.pray-box-list-leave-active {
  position: absolute;
}

.card-column-1 {
  flex-basis: 100%;
  border: 2px solid white;

  @media (width > $tablet) {
    flex-basis: 48%;
  }

  @media (width >= $desktop) {
    flex-basis: 32%;
  }
}
</style>
