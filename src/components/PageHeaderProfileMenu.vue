<template>
  <Suspense v-if="editProfileSuspense">
    <EditProfileComponent v-model="editProfile" />
  </Suspense>

  <q-menu v-model="openMenu">
    <q-list style="min-width: 200px">
      <template v-if="auth.role.includes('admin')">
        <q-item clickable v-close-popup>
          <q-item-section @click="() => router.push({ name: 'users' })">
            Użytkownicy
          </q-item-section>
        </q-item>
        <q-separator />
      </template>
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
import { useRouter } from "vue-router";

const auth = useAuth();
const router = useRouter();

const EditProfileComponent = defineAsyncComponent({
  loader: () => import("./PageHeaderProfileMenuEdit.vue"),
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
