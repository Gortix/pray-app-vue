<template>
  <q-toolbar>
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
    <q-btn round flat>
      <q-icon size="2.5rem" color="blue-grey-1" name="o_account_circle" />
      <ProfileMenu />
    </q-btn>
  </q-toolbar>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import ProfileMenu from "./ProfileMenu.vue";

const router = useRouter();
</script>
