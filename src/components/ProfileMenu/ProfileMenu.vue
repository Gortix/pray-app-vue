<template>
  <Suspense v-if="editProfileSuspense">
    <EditProfileComponent v-model="editProfile" />
  </Suspense>

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
</template>
<script lang="ts" setup>
import { useAuth } from "@/store/auth";
import { ref, defineAsyncComponent, watch } from "vue";

const auth = useAuth();

const EditProfileComponent = defineAsyncComponent({
  loader: () => import("./EditProfileComponent.vue"),
});

const editProfile = ref(false);
const editProfileSuspense = ref(false);
const openMenu = ref(false);

const unwatch = watch(editProfile, () => {
  if (editProfile.value) {
    editProfileSuspense.value = true;
    unwatch();
  }
});
</script>
