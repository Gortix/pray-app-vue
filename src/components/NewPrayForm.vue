<template>
  <form @submit.prevent="simulateSubmit" class="custom-flex">
    <q-select v-model="user" :options="options" label="Standard" />
    <!-- <q-input v-model="user" type="text" color="teal" label="Imię i nazwisko:" /> -->
    <q-input
      v-model="description"
      type="textarea"
      color="teal"
      label="Treść modlitwy:"
    />
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
import { ref } from "vue";

const store = useStore();
store.getListOfUsers();

const options = computed(() => {
  type Options = { label: string; value: string };
  const listOfUsers: Options[] = [];
  for (const user of store.users) {
    listOfUsers.push({ label: user.name, value: user.id });
  }
  return listOfUsers;
});

const description = ref("");
const user = ref("");
const submitting = ref(false);

const simulateSubmit = () => {
  submitting.value = true;

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
