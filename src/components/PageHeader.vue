<template>
  <Teleport to="body">
    <BasicPopup v-model="toolbar" title="Ddaja modlitwę">
      <template #default>
        <NewPrayForm @submit="() => (toolbar = false)" />
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

    <q-btn round color="info" @click="()=> {te(); toolbar = true}">
      <span style="font-size: 1.3rem">&plus;</span></q-btn
    >
  </q-toolbar>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import BasicPopup from "./BasicPopup.vue";
import NewPrayForm from "./NewPrayForm.vue";
import {useAuth} from "../store/auth"

const auth = useAuth();
const te = ()=>{
  auth.authorize();
  // navigator.clipboard.writeText('Text to get copied')
}
const toolbar = ref(false);
</script>
