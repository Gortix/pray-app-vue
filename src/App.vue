<template>
  <LoginPage v-if="!auth.loggedIn" @login="auth.authorize" />
  <Suspense v-else>
    <q-layout view="hHh lpR fFf">
      <q-header class="bg-white text-white" height-hint="98">
        <PageHeader class="bg-primary text-white" style="z-index: 100" />
        <Transition>
          <ControlPanel
            class="absolute absolute-top full-height"
            v-if="renderPanel"
            style="z-index: 100000"
          />
        </Transition>
      </q-header>

      <q-page-container
        class="row wrap q-mt-sm q-pa-xs custom-gap"
        v-if="data[0]"
      >
        <PrayBox
          v-for="rec in store.data"
          :key="rec.id"
          v-bind="rec"
          :owner="rec.owner.name"
          @remove-doc="() => store.removePray(rec.id as string)"
          :my-pray="rec.owner.id == auth.profile.id"
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
import ControlPanel from "./components/ControlPanel.vue";

const auth = useAuth();
const store = useStore();

const renderPanel = ref(true);

const data = computed(() => store.getSortedData);

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
