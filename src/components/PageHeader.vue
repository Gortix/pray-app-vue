<template>
  <q-toolbar>
    <q-toolbar-title>
      <q-avatar>
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
      </q-avatar>
      Kościół w Działdowie
    </q-toolbar-title>
    <q-btn dense flat class="q-mr-sm " round icon="o_filter_alt" @click="(el) =>$emit('filterMenuAction')" />
    <q-btn round flat>
      <q-icon size="2.5rem" color="blue-grey-1" name="o_account_circle" />
      <ProfileMenu />
    </q-btn>
  </q-toolbar>
</template>
<script setup lang="ts">
import ProfileMenu from "./ProfileMenu/ProfileMenu.vue";
</script>
