<template>
  <LoginPage v-if="!auth.loggedIn" @login="auth.authorize" />
  <Suspense v-else>
    <q-layout view="hHh lpR fFf">
      <q-header elevated class="bg-primary text-white" height-hint="98">
        <PageHeader />
      </q-header>
      <q-page-container class="row wrap q-mt-sm q-pa-xs" v-if="data[0]">
        <PrayBox
          v-touch-hold.mouse="(details: Details)=>touchHoldHandler(details, rec.id as string)"
          v-for="rec in store.data"
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
import { useStore } from "@/store/index";
import { computed, ref } from "vue";
import PageHeader from "./components/PageHeader.vue";
import { useAuth } from "./store/auth";
import LoginPage from "./components/LoginPage.vue";
import { auth as mainAuthObject } from "./@firebase/index";

const auth = useAuth();
const store = useStore();

const data = computed(() => store.getSortedData);

const selectedList = ref<string[]>([]);

const isSelected = (recID: string) => {
  return selectedList.value.findIndex((el) => el == recID) >= 0;
};

interface Details {
  evt: Event;
  touch: boolean;
  mouse: boolean;
  position: { top: number; left: number };
  duration: number;
}
const touchHoldHandler = (details: Details, recID: string) => {
  console.log(details.evt);
  const indexOfSelectedPray = selectedList.value.findIndex(
    (element) => {
      console.log(element);
      
      return element == recID}
  );
  console.log(indexOfSelectedPray);

  if (indexOfSelectedPray >= 0) {
    selectedList.value.splice(indexOfSelectedPray, 1);
    return;
  }
  selectedList.value.push(recID);
  console.log(selectedList.value);

  // checkedPrays.value[recID] = !checkedPrays.value[recID];
};

// navigator.clipboard.writeText('Text to get copied')
mainAuthObject.onAuthStateChanged(async (user) => {
  auth.loggedIn = user != null;
  await store.getListOfUsers();
  await store.getListOfPray();

  const profileId = (await auth.getUserProfileID()) as string;
  const userProfile = store.users[profileId];
  if (userProfile) {
    auth.profile = userProfile;
  }
});
</script>
<style lang="scss">
* {
  box-sizing: border-box;
}

.row {
  gap: 0.6rem;
  @media (width > $tablet) {
    gap: 1rem;
  }
}
</style>
