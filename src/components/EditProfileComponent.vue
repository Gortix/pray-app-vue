<template>
  <BasicPopup v-model="editProfile">
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
  </BasicPopup>
</template>
<script setup lang="ts">
import { onMounted, defineProps, defineEmits, computed, ref } from "vue";
import { useStore } from "@/store/index";
import BasicPopup from "./BasicPopup.vue";

const store = useStore();

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

onMounted(async () => {
  userName.value = await store.getUserProfile();
});

const submit = async () => {
  submitting.value = true;
  store.updateUserProfile(userName.value);
  submitting.value = false;
};
</script>
