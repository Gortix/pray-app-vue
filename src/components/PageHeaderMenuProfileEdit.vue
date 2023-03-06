<template>
  <AppPopup title="Mój profil" v-model="editProfile">
    <form @submit.prevent="submit" class="custom-flex">
      <q-input v-model="userName" label="Nazwa użytkownika" />
      <q-btn
        type="submit"
        :loading="submitting"
        label="Aktualizauj"
        class="q-mt-lg full-width"
        color="teal m-t"
      >
        <template v-slot:loading>
          <q-spinner-facebook />
        </template>
      </q-btn>
    </form>
  </AppPopup>
</template>
<script setup lang="ts">
import { onMounted, defineProps, defineEmits, computed, ref } from "vue";
import AppPopup from "./AppPopup.vue";
import { useAuth } from "@/store/auth";

const auth = useAuth();

const props = defineProps({ modelValue: Boolean, title: String });
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): boolean;
}>();

const submitting = ref(false);
const userName = ref("");

const editProfile = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const submit = async () => {
  submitting.value = true;
  if (userName.value != auth.profile.name) {
    await auth.updateUserProfile(userName.value);
    editProfile.value = false;
  }
  submitting.value = false;
};

onMounted(async () => {
  userName.value = auth.profile.name;
});
</script>
