<template>
  <q-toolbar>
    <q-toolbar-title>
      <q-avatar square size="2rem">
        <img src="@/assets/logo-kch.png" />
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
import ProfileMenu from "./ProfileMenu.vue";
</script>
