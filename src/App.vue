<template>
  <router-view />
</template>
<script setup lang="ts">
import { auth as firebaseAuthObject } from "@/@firebase/index";
import { useAuth } from "@/store/auth";
import { useStore } from "@/store/index";
import { usePageState } from "@/store/pageState";
import { useRouter, useRoute } from "vue-router";

const auth = useAuth();
const store = useStore();
const pageState = usePageState();
const router = useRouter();
const route = useRoute();

firebaseAuthObject.onAuthStateChanged(async (user) => {
  auth.loggedIn = user != null;
  if (auth.loggedIn) {
    let { redirect, ...rest } = route.query;
    if (!redirect) redirect = "prayers";

    router.replace({ name: redirect as string, query: rest });
  } else {
    router.replace({ name: "login" });
  }
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
  margin: 0;
  padding: 0;
}
</style>
