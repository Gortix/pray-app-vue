<template>
  <q-btn
    class="fixed-center"
    size="lg"
    v-if="!auth.loggedIn"
    @click="authAndRefresh"
    color="primary"
    label="Zaloguj się do aplikacji modlitewnej"
  />
  <template v-else>
    <q-layout view="hHh lpR fFf">
      <q-header elevated class="bg-primary text-white" height-hint="98">
        <PageHeader />
      </q-header>

      <q-page-container class="row wrap q-mt-sm q-pa-xs" v-if="data[0]">
        <PrayBox
          v-for="rec in store.data"
          :key="rec.id"
          v-bind="rec"
          :owner="rec.owner?.name || ''"
          @remove-doc="() => store.removePray(rec.id)"
        />
      </q-page-container>
    </q-layout>
  </template>
</template>

<script setup lang="ts">
import PrayBox from "./components/PrayBox.vue";
import { useStore } from "@/store/index";
import { computed } from "@vue/runtime-core";
import PageHeader from "./components/PageHeader.vue";
import { useAuth } from "./store/auth";

const auth = useAuth();

const authAndRefresh = async () => {
  await auth.authorize();
  store.getListOfPray();

  // navigator.clipboard.writeText('Text to get copied')
};

const store = useStore();
store.getListOfPray();

const data = computed(() => store.data);
</script>
<style lang="scss">
#app {
  box-sizing: border-box;
}
.row {
  gap: 0.6rem;
  @media (width > $tablet) {
    gap: 1rem;
  }
}
</style>
