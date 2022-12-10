<template>
  <EditProfileComponent v-model="editProfile" />
  <q-toolbar>
    <q-toolbar-title>
      <q-avatar>
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
      </q-avatar>
      Kościół w Działdowie
    </q-toolbar-title>
    <q-btn round flat>
      <q-icon size="2.5rem" color="blue-grey-1" name="o_account_circle" />
      <q-menu v-model="openMenu">
        <q-list style="min-width: 200px">
          <q-item clickable v-close-popup>
            <q-item-section @click="() => (editProfile = true)">
              Edytuj profil
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-close-popup>
            <q-item-section @click="auth.singOut">Wyloguj</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </q-toolbar>
</template>
<script lang="ts" setup>
import { useAuth } from "@/store/auth";
// import EditProfileComponent from "./EditProfileComponent.vue";
import { ref, defineAsyncComponent } from "vue";

const auth = useAuth();

const EditProfileComponent = defineAsyncComponent({
  loader: () => import("./EditProfileComponent.vue"),
});

const editProfile = ref(false);
const openMenu = ref(false);
</script>
