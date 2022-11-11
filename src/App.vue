<template>
  <NewPrayForm v-model="toolbar" />

  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          Kościół w Działdowie
        </q-toolbar-title>
        <q-btn round color="info" @click="toolbar = true">
          <span style="font-size: 1.3rem">&plus;</span></q-btn
        >
      </q-toolbar>
    </q-header>

    <q-page-container v-if="data[0]">
      <PrayBox
        v-for="rec in store.data"
        :key="rec.id"
        v-bind="rec"
        :owner="rec.owner?.name || ''"
      />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import PrayBox from "./components/PrayBox.vue";
import { useStore } from "@/store/index";
import { computed } from "@vue/runtime-core";
import { ref } from "vue";
import NewPrayForm from "./components/NewPrayForm.vue";

const toolbar = ref(false);

const store = useStore();
store.getListOfPray();

const data = computed(() => store.data);
</script>
<style lang="scss">
#app {
  margin: 1.5rem;
}
</style>
