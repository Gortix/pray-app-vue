<template>
  <router-view />
</template>
<script setup lang="ts">
import { auth as firebaseAuthObject } from "@/@firebase/index";
import { useAuth } from "@/store/auth";
import { useStore } from "@/store/index";
import { usePageState } from "@/store/pageState";
import { usePrayFilter } from "@/store/filterStore";
import { useRouter, useRoute } from "vue-router";
import { computed, onMounted, watch } from "vue";

const auth = useAuth();
const store = useStore();
const pageState = usePageState();
const filterStore = usePrayFilter();
const router = useRouter();
const route = useRoute();

const archived = computed(() => route.query.archived == "true");

firebaseAuthObject.onAuthStateChanged(async (user) => {
  auth.loggedIn = user != null;
  if (!auth.loggedIn) {
    router.replace({ name: "login" });
    return;
  }

  let { redirect, ...rest } = route.query;
  if (!redirect) redirect = "prayers";

  router.replace({ name: redirect as string, query: rest });  
  await store.getListOfUsers();
  await store.getListOfPray(route.query.archived == "true");

  const profileId = (await auth.getUserProfileID()) as string;
  const userProfile = store.users[profileId];

  if (userProfile) {
    auth.profile = userProfile;
  }
});

onMounted(() => {
  pageState.updateArchived(archived.value);
  filterStore.archived = archived.value;
});
watch(archived, (value) => {
  pageState.updateArchived(value);
  filterStore.archived = value;
});
</script>
<style lang="scss">
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
