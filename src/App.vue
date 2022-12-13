<template>
  <LoginPage v-if="!auth.loggedIn" @login="auth.authorize" />
  <Suspense v-else>
    <q-layout view="hHh lpR fFf">
      <q-header elevated class="bg-primary text-white" height-hint="98">
        <PageHeader />
      </q-header>

      <q-page-container class="row wrap q-mt-sm q-pa-xs" v-if="data[0]">
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
import { computed } from "vue";
import PageHeader from "./components/PageHeader.vue";
import { useAuth } from "./store/auth";
import LoginPage from "./components/LoginPage.vue";
import { auth as mainAuthObject } from "./@firebase/index";

const auth = useAuth();
const store = useStore();

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
*{
  box-sizing: border-box;
}

.row {
  gap: 0.6rem;
  @media (width > $tablet) {
    gap: 1rem;
  }
}
</style>
