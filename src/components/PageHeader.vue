<template>
  <Teleport to="body">
    <BasicPopup v-model="toolbar" title="Ddaja modlitwę">
      <template #default>
        <NewPrayForm />
      </template>
    </BasicPopup>
  </Teleport>

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
</template>
<script lang="ts" setup>
import { ref } from "vue";
import BasicPopup from "./BasicPopup.vue";
import NewPrayForm from "./NewPrayForm.vue";

const toolbar = ref(false);
</script>
