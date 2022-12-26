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
      <q-drawer :width="230" v-model="showFilterMenu" side="right" bordered>
        <FiltersMenu />
      </q-drawer>
      <q-page-container v-if="data[0]">
        <PrayList />
      </q-page-container>
      <AddPrayCompoment />
    </q-layout>
  </Suspense>
</template>

<script setup lang="ts">
import AddPrayCompoment from "./components/AddPrayCompoment.vue";
import FiltersMenu from "./components/FiltersMenu.vue";
import { useStore } from "@/store/index";
import { computed, ref, watch } from "vue";
import PageHeader from "./components/PageHeader.vue";
import { useAuth } from "./store/auth";
import LoginPage from "./components/LoginPage.vue";
import { auth as mainAuthObject } from "./@firebase/index";
import ControlPanel from "./components/ControlPanel.vue";
import PrayList from "./components/PrayList/PrayList.vue";
import { useSelectedList } from "./store/selectedList";

const auth = useAuth();
const store = useStore();
const slStore = useSelectedList();

const renderPanel = ref(false);
const showFilterMenu = ref(false);

const data = computed(() => store.getFilteredData);

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
});

watch(
  () => slStore.selectedList.length,
  (len) => {
    renderPanel.value = len > 0;
  }
);
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

.render-list {
  padding: 0;
  list-style-type: none;
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
