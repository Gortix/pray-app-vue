<template>
  <q-toolbar class="relative-position">
    <q-icon
      class="cursor-pointer"
      square
      size="2rem"
      @click="() => router.push({ name: 'prayers' })"
    >
      <img src="@/assets/logo-kch.png" />
    </q-icon>
    <Transition mode="out-in" name="header-title">
      <q-toolbar-title v-if="showTitle"> Kościół w Działdowie </q-toolbar-title>
      <q-toolbar-title v-else> </q-toolbar-title>
    </Transition>
    <!-- <q-btn
      dense
      flat
      class="q-mr-sm"
      round
      icon="o_menu"
      @click="(el) => $emit('filterMenuAction')"
    /> -->
    <div class="col-xs-9 col-sm row absolute z-top">
      <Transition>
        <q-input
          v-if="showSearcher"
          class="col"
          bg-color="primary"
          v-model="searchText"
          label="Szukaj"
          color="light-blue-3"
          dense
          dark
          ref="searchInput"
        >
          <template #append>
            <q-icon
              v-if="searchText !== ''"
              name="close"
              @click="searchText = ''"
              class="cursor-pointer"
            />
            <q-icon v-else />
          </template>
        </q-input>
        <q-space v-else class="col" />
      </Transition>
      <q-btn flat @click="showSearcher = !showSearcher" icon="search" />
    </div>
    <q-btn round flat>
      <q-icon size="2.5rem" color="blue-grey-1" name="o_account_circle" />
      <PageHeaderMenuProfile />
    </q-btn>
  </q-toolbar>
</template>
<script setup lang="ts">
import {
  ref,
  computed,
  inject,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { useRouter } from "vue-router";
import PageHeaderMenuProfile from "./PageHeaderProfileMenu.vue";

const checkIsMobile = () => {
  isMobileScreen.value = screen.width <= 600;
};

const router = useRouter();

const searchText = inject("searchText", "");
const isMobileScreen = ref(screen.width <= 600);
const showSearcher = ref(false);
const searchInput = ref<HTMLInputElement>();
const showTitle = computed(() =>
  isMobileScreen.value ? !showSearcher.value : true
);

watch(showSearcher, (val) => {
  if (val) {
    setTimeout(() => {
      searchInput.value?.focus();
    }, 100);
  }
});

onMounted(() => {
  nextTick(() => {
    window.addEventListener("resize", checkIsMobile);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkIsMobile);
});
</script>
<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transform-origin: 110%;
  transition: all 0.5s linear;
}

.v-enter-from,
.v-leave-to {
  transform: scaleX(0);
}
.header-title-enter-active,
.header-title-leave-active {
  transform-origin: -10%;
  transition: all 0.35s linear;
}

.header-title-enter-from,
.header-title-leave-to {
  transform: scaleX(0);
}
.absolute {
  right: 3rem;
}
</style>
