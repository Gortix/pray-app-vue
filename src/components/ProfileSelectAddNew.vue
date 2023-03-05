<template>
  <div>
    <q-input class="col" v-model="newUserName" label="Imię nazwisko" />
    <q-btn
      type="button"
      @click="addNewProfile"
      flat
      color="primary"
      label="Dodaj"
    />
    <q-btn
      type="button"
      @click="() => emit('close')"
      flat
      color="negative"
      label="&#10005;"
    />
  </div>
</template>
<script setup lang="ts">
import { useStore } from "@/store";
import { useQuasar } from "quasar";
import { defineProps, defineEmits, ref } from "vue";

const props = defineProps({
  emitValue: { type: Boolean, default: false },
});
const emit = defineEmits(["add-profile", "close"]);

const store = useStore();
const $q = useQuasar();

const newUserName = ref("");

const notify = (message: string) => {
  $q.notify({
    message,
    color: "warning",
    textColor: "black",
    position: "top",
  });
};

const addNewProfile = async () => {
  newUserName.value = newUserName.value.trim();

  if (!newUserName.value) return notify("Podaj imię i nazwisko");

  if (store.getProfileOptions.find((el) => el.label == newUserName.value))
    return notify("Taki użytkownik już istnieje");

  const profileID = (await store.addProfile(newUserName.value)) as string;

  emit(
    "add-profile",
    props.emitValue ? profileID : { label: newUserName.value, value: profileID }
  );

  newUserName.value = "";
};
</script>
