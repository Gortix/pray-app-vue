<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-white" height-hint="98">
      <PageHeader
        class="bg-primary text-white"
        style="z-index: 100"
        @filter-menu-action="showFilterMenu = !showFilterMenu"
        v-once
      />
      <Transition>
        <PageHeaderControlPanel
          class="absolute absolute-top full-height"
          v-if="renderPanel"
          style="z-index: 100000"
        />
      </Transition>
    </q-header>
    <q-drawer :width="230" v-model="showFilterMenu" side="right" bordered>
      <PrayerFiltersMenu />
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <PrayerPopup v-if="route.name == 'prayers'" />
  </q-layout>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, watch } from "vue";
import PageHeader from "@/components/PageHeader.vue";
import { useSelectedList } from "@/store/selectedList";
import { useRoute } from "vue-router";
const PrayerPopup = defineAsyncComponent(
  () => import("@/components/PrayerPopup.vue")
);
const PrayerFiltersMenu = defineAsyncComponent(
  () => import("@/components/PrayerFiltersMenu.vue")
);
const PageHeaderControlPanel = defineAsyncComponent(
  () => import("@/components/PageHeaderControlPanel.vue")
);

const slStore = useSelectedList();
const route = useRoute();

const renderPanel = ref(false);
const showFilterMenu = ref(false);

watch(
  () => slStore.selectedList.length,
  (len) => {
    renderPanel.value = len > 0;
  }
);
</script>
<style lang="scss">
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

.pray-box-list-enter-from,
.pray-box-list-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.pray-box-list-leave-active {
  position: absolute;
}
</style>
