<template>
  <LoginPage v-if="!auth.loggedIn" @login="auth.authorize" />
  <Suspense v-else>
    <q-layout view="hHh lpR fFf">
      <q-header class="bg-white text-white" height-hint="98">
        <PageHeader
          class="bg-primary text-white"
          style="z-index: 100"
          @filter-menu-action="showFilterMenu = !showFilterMenu"
        />
        <Transition>
          <ControlPanel
            class="absolute absolute-top full-height"
            v-if="renderPanel"
            style="z-index: 100000"
          />
        </Transition>
      </q-header>
      <q-drawer
        :width="230"
        v-model="showFilterMenu"
        side="right"
        bordered
      >
        <FiltersMenu />
      </q-drawer>
      <q-page-container
        class="row wrap q-mt-sm q-pa-xs custom-gap"
        v-if="data[0]"
      >
        <PrayBox
          v-touch-hold.mouse="(details: Details)=>touchHoldHandler(details, rec.id as string)"
          v-for="rec in data"
          :key="rec.id"
          v-bind="rec"
          :owner="rec.owner.name"
          @remove-doc="() => store.removePray(rec.id as string)"
          :my-pray="rec.owner.id == auth.profile.id"
          :selected="isSelected(rec.id as string)"
        />
      </q-page-container>
      <AddPrayCompoment />
    </q-layout>
  </Suspense>
</template>

<script setup lang="ts">
import PrayBox from "./components/PrayBox.vue";
import AddPrayCompoment from "./components/AddPrayCompoment.vue";
import FiltersMenu from "./components/FiltersMenu.vue";
import { useStore } from "@/store/index";
import { Details } from "@/@types/quasar";
import { computed, ref } from "vue";
import PageHeader from "./components/PageHeader.vue";
import { useAuth } from "./store/auth";
import LoginPage from "./components/LoginPage.vue";
import { auth as mainAuthObject } from "./@firebase/index";
import ControlPanel from "./components/ControlPanel.vue";

const auth = useAuth();
const store = useStore();

const renderPanel = ref(false);
const showFilterMenu = ref(false);
const selectedList = ref<string[]>([]);

const data = computed(() => store.getFilteredData);

const isSelected = (recID: string) => {
  return selectedList.value.findIndex((el) => el == recID) >= 0;
};

const touchHoldHandler = (details: Details, recID: string) => {
  details;
  const indexOfSelectedPray = selectedList.value.findIndex((element) => {
    return element == recID;
  });

  if (indexOfSelectedPray >= 0) {
    selectedList.value.splice(indexOfSelectedPray, 1);
    return;
  }
  selectedList.value.push(recID);
};

mainAuthObject.onAuthStateChanged(async (user) => {
  auth.loggedIn = user != null;
  await store.getListOfUsers();
  await store.getListOfPray();

  const profileId = (await auth.getUserProfileID()) as string;
  const userProfile = store.users[profileId];

  if (userProfile) {
    auth.profile = userProfile;
    return;
  }

  //TODO: Create profile for new user
});
</script>
<style lang="scss">
* {
  box-sizing: border-box;
}

.custom-gap {
  gap: 0.6rem;
  @media (width > $tablet) {
    gap: 1rem;
  }
}

.v-enter-active,
.v-leave-active {
  transition: all 0.5s linear;
}

.v-enter-from,
.v-leave-to {
  transform: scaleX(0) translateX(-50%);
  transform-origin: left top;
  // perspective: 1000;
}
</style>
