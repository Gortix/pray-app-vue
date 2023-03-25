<template>
  <PrayerCategoryHeader :archived="archived" />
  <PrayerFiltersHeader />
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
    <AppPopup v-model="editPray" title="Aktualizuj modlitwę">
      <template #default>
        <PrayForm :data="popupData" @submit="() => (editPray = false)" />
      </template>
    </AppPopup>
  </Suspense>
</template>
<script setup lang="ts">
import { ref, computed, inject, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "@/store";
import { useAuth } from "@/store/auth";
import { useSelectedList } from "@/store/selectedList";
import { usePrayFilter } from "@/store/filterStore";
import PrayBox from "@/components/PrayerBox.vue";
import AppPopup from "@/components/AppPopup.vue";
import PrayForm from "@/components/PrayerForm.vue";
import { PrayBoxTypes } from "@/@types/components";
import PrayerFiltersHeader from "@/components/PrayerFiltersHeader.vue";
import PrayerCategoryHeader from "@/components/PrayerCategoryHeader.vue";

const route = useRoute();
const store = useStore();
const auth = useAuth();
const slStore = useSelectedList();
const filterStore = usePrayFilter();

const toolbar = ref(false);
const editPray = ref(false);
const popupData = ref({} as PrayBoxTypes);
const searchText = inject("searchText", ref(""));

const data = computed(() => {
  const lower = searchText.value.trim().toLowerCase();

  if (lower.length < 3) {
    return store.getFilteredData;
  }

  return store.getFilteredData.filter(
    (el: PrayBoxTypes) =>
      el.description.toLowerCase().includes(lower) ||
      el.owner.name.toLowerCase().includes(lower)
  );
});
const selectedList = computed(() => slStore.selectedList);
const archived = computed(() => route.query.archived === "true");

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

watch(archived, (value) => {
  store.getListOfPray(true);
  filterStore.archived = value;
});
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

  $boxMinValue: 350px;
  //min avlue of the box is 350 + margin
  @media (width > (($boxMinValue *2)+50px )) {
    flex-basis: 48%;
  }

  @media (width >= $desktop) {
    flex-basis: 32%;
  }
}
</style>
