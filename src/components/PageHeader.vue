<template>
  <q-toolbar>
    <q-toolbar-title>
      <q-avatar>
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
      </q-avatar>
      Kościół w Działdowie
    </q-toolbar-title>

    <q-btn round flat @click="auth.singOut">
      <q-icon size="2.5rem" color="blue-grey-1" name="o_account_circle" />
    </q-btn>
  </q-toolbar>
</template>
<script lang="ts" setup>
import { useAuth } from "@/store/auth";

const auth = useAuth();
</script>
