<template>
  <q-toolbar  class="relative-position">
    <q-toolbar-title>
      <q-avatar
        class="cursor-pointer"
        square
        size="2rem"
        @click="() => router.push({ name: 'prayers' })"
      >
        <img src="@/assets/logo-kch.png" />
      </q-avatar>
      Kościół w Działdowie
    </q-toolbar-title>
    <!-- <q-btn
      dense
      flat
      class="q-mr-sm"
      round
      icon="o_menu"
      @click="(el) => $emit('filterMenuAction')"
    /> -->
    <div class="row absolute z-top">
      <Transition>
        <q-input
          v-if="showSearcher"
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
      </Transition>
      <q-btn flat @click="showSearcher = !showSearcher" icon="search" />
    </div>
    <q-btn round flat>
      <q-icon size="2.5rem" color="blue-grey-1" name="o_account_circle" />
      <ProfileMenu />
    </q-btn>
  </q-toolbar>
</template>
<script setup lang="ts">
import { ref, inject, watch } from "vue";
import { useRouter } from "vue-router";
import ProfileMenu from "./ProfileMenu.vue";

const router = useRouter();

const searchText = inject("searchText", "");
const showSearcher = ref(false);
const searchInput = ref<HTMLInputElement>();

watch(showSearcher, (val) => {
  if (val) {
    setTimeout(() => {
      searchInput.value?.focus();
    }, 100);
  }
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
.absolute{
  right: 3rem;
}

@keyframes sho {
  
}
</style>
