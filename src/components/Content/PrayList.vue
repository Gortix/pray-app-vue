<template>
  <PrayListFiltersPanel />
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
        @open="openPopup"
        @edit="openEdit"
      />
    </li>
  </TransitionGroup>
  <Suspense>
    <q-dialog v-model="toolbar" auto-close>
      <PrayBox v-bind="popupData" />
    </q-dialog>
  </Suspense>
  <Suspense>
    <BasicPopup v-model="editPray" title="Aktualizuj modlitwę">
      <template #default>
        <PrayForm :data="popupData" @submit="() => (editPray = false)" />
      </template>
    </BasicPopup>
  </Suspense>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useStore } from "@/store/index";
import { useAuth } from "@/store/auth";
import { useSelectedList } from "@/store/selectedList";
import PrayBox from "./PrayBox.vue";
import BasicPopup from "../BasicPopup.vue";
import PrayForm from "../Pray/PrayForm.vue";
import { PrayBoxTypes } from "@/@types/components";
import PrayListFiltersPanel from "../PrayListFiltersPanel.vue";

const store = useStore();
const auth = useAuth();
const slStore = useSelectedList();

const toolbar = ref(false);
const editPray = ref(false);
const popupData = ref({} as PrayBoxTypes);

const data = computed(() => store.getFilteredData);
const selectedList = computed(() => slStore.selectedList);

const isSelected = (recID: string) => {
  return selectedList.value.findIndex((el) => el == recID) >= 0;
};

const openPopup = (data: PrayBoxTypes) => {
  popupData.value = { ...data, fullSize: true };
  toolbar.value = true;
};

const openEdit = (data: PrayBoxTypes) => {
  popupData.value = data;
  editPray.value = true;
};

const convertDataForPrayBox = (data: PrayBoxTypes) => {
  const convData = {
    ...data,
    myPray: data.owner.id == auth.profile.id,
    selected: isSelected(data.id as string),
    selectedMode: slStore.selectedList.length > 0,
    adminMode: ["admin", "superadmin"].includes(auth.role),
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
