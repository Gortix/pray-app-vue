<template>
  <PrayerCategoryHeader :archived="archived" />
  <PrayerFiltersHeader v-once />
  <q-resize-observer @resize="(size) => (qCardSize = size)" />

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
        @archive="openArchiver"
        @unarchive="unarchive"
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
  <Suspense>
    <AppPopup v-model="archivePrayer" title="Złóż świadectwo">
      <template #default>
        <PrayerArchiveForm
          :data="popupData"
          @submit="() => (archivePrayer = false)"
        />
      </template>
    </AppPopup>
  </Suspense>
</template>
<script setup lang="ts">
import { ref, computed, watch, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "@/store";
import { useAuth } from "@/store/auth";
import { useSelectedList } from "@/store/selectedList";
import { usePrayFilter } from "@/store/filterStore";
import { sortPrayByTime } from "@/functions/helpers";
import PrayBox from "@/components/PrayerBox.vue";
import { PrayBoxTypes } from "@/@types/components";
import PrayerFiltersHeader from "@/components/PrayerFiltersHeader.vue";
import PrayerCategoryHeader from "@/components/PrayerCategoryHeader.vue";
import AppPopup from "@/components/AppPopup.vue";
import { Pray } from "@/@types/database";
import { usePageState } from "@/store/pageState";
const PrayForm = defineAsyncComponent(
  () => import("@/components/PrayerForm.vue")
);
const PrayerArchiveForm = defineAsyncComponent(
  () => import("@/components/PrayerArchiveForm.vue")
);

const route = useRoute();
const store = useStore();
const auth = useAuth();
const pageState = usePageState();
const slStore = useSelectedList();
const filterStore = usePrayFilter();

const toolbar = ref(false);
const editPray = ref(false);
const archivePrayer = ref(false);
const popupData = ref({} as PrayBoxTypes);
const qCardSize = ref<{ width: number; height: number }>({
  width: 0,
  height: 0,
});

const dataStore = computed(() =>
  sortPrayByTime(
    store.getFilteredData,
    archived.value ? "archive_date" : "date"
  )
);

const data = computed(() => {
  const lower = pageState.searchTextLower;

  if (lower.length < 3) {
    return dataStore.value;
  }

  const includesSearchText = (text: string) =>
    text.toLowerCase().includes(lower);

  return dataStore.value.filter(
    (el) =>
      includesSearchText(el.description) ||
      includesSearchText(el.owner.name) ||
      (el.archived && includesSearchText(el.archive_description ?? ""))
  );
});
const selectedList = computed(() => slStore.selectedList);
const archived = computed(() => pageState.archived);

const height = (archived: boolean) => {
  if (!archived) return "170px";
  if (qCardSize.value?.width < 440) return "250px";

  return "230px";
};
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

const openArchiver = (data: PrayBoxTypes) => {
  popupData.value = data;
  archivePrayer.value = true;
};

const unarchive = (data: PrayBoxTypes) => {
  if (!data.id) return;
  store.archivePrayer(data.id, { archived: false });
};

const convertDataForPrayBox = (data: Pray) => {
  const convData: PrayBoxTypes = {
    ...data,
    myPray: data.owner.id == auth.profile.id,
    selected: isSelected(data.id as string),
    selectedMode: slStore.selectedList.length > 0,
    adminMode: ["admin", "superadmin"].includes(auth.role),
    height: height(data.archived),
  };

  return convData;
};

watch(archived, (value) => {
    store.getListOfPray(value);
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
