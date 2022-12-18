<template>
  <form @submit.prevent="simulateSubmit" class="custom-flex">
    <div class="row">
      <q-select
        class="col"
        v-model="user"
        :options="options"
        emit-value
        map-options
        label="Standard"
      />
      <q-btn
        type="button"
        @click="showAddNew = !showAddNew"
        flat
        color="positive"
        label="&#43;"
      />
    </div>
    <div class="row" v-if="showAddNew">
      <q-input class="col" v-model="newUserName" label="Imię nazwisko" />
      <q-btn
        type="button"
        @click="addNewProfile"
        flat
        color="primary"
        label="Dodaj"
      />
    </div>
    <q-input v-model="description" type="textarea" label="Treść modlitwy:" />
    <q-btn
      type="submit"
      :loading="submitting"
      label="Proszę o modlitwę"
      class="q-mt-md full-width"
      color="teal"
    >
      <template v-slot:loading>
        <q-spinner-facebook />
      </template>
    </q-btn>
  </form>
</template>
<script lang="ts" setup>
import { useStore } from "@/store/index";
import { computed } from "@vue/reactivity";
import { ref, defineEmits } from "vue";

const store = useStore();
store.getListOfUsers();
const emit = defineEmits(["submit"]);

const options = computed(() => {
  type Options = { label: string; value: string };
  const listOfUsers: Options[] = [];
  const users = store.users;

  for (const k of Object.keys(users)) {
    listOfUsers.push({ label: users[k].name, value: users[k].id });
  }

  return listOfUsers;
});

const description = ref("");
const user = ref("");
const newUserName = ref("");
const showAddNew = ref(false);
const submitting = ref(false);

const addNewProfile = async () => {
  await store.addProfile(newUserName.value);
  newUserName.value = "";
  showAddNew.value = false;
};

const simulateSubmit = async () => {
  submitting.value = true;
  showAddNew.value = false;

  await store.addPray(user.value, description.value);
  description.value = "";
  user.value = "";
  emit("submit");
  submitting.value = false;
};
</script>
<style lang="scss">
.custom-flex {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
