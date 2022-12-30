<template>
  <router-view />
</template>
<script setup lang="ts">
import { auth as firebaseAuthObject } from "@/@firebase/index";
import { useAuth } from "@/store/auth";
import { useStore } from "@/store/index";
import { useRouter, useRoute } from "vue-router";

const auth = useAuth();
const store = useStore();
const router = useRouter();

firebaseAuthObject.onAuthStateChanged(async (user) => {
  auth.loggedIn = user != null;
  if (auth.loggedIn) {
    router.push({ name: "prayers" });
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
