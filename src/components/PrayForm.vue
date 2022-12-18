<template>
  <form @submit.prevent="simulateSubmit" class="custom-flex">
    <q-select
      v-model="user"
      :options="options"
      emit-value
      map-options
      label="Standard"
    />
    <q-input
      v-model="date"
      :rules="[(val) => datePattern.test(val)]"
      label="Data zgłoszenia"
      color="primary"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="date" mask="DD.MM.YYYY">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
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
import { ref, defineEmits, onMounted } from "vue";
import { useAuth } from "@/store/auth";
import { useQuasar } from "quasar";

const datePattern = /^[0-3]\d.[0-1]\d.[\d]{4}$/;
const d = new Date();
const store = useStore();
const auth = useAuth();
const $q = useQuasar();
const emit = defineEmits(["submit"]);

const description = ref("");
const user = ref("");
const date = ref(`${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`);
const submitting = ref(false);

const options = computed(() => {
  type Options = { label: string; value: string };
  const listOfUsers: Options[] = [];
  const users = store.users;

  for (const k of Object.keys(users)) {
    listOfUsers.push({ label: users[k].name, value: users[k].id });
  }

  return listOfUsers;
});

const simulateSubmit = async () => {
  let errorWhileSubmit = false;
  submitting.value = true;
  const [day, month, year] = date.value.split(".");

  if (!date.value || !description.value || !user.value) {
    $q.notify({
      message: "Uzupełnij wszystkie pola",
      color: "negative",
      position: "top",
    });
    submitting.value = false;

    return;
  }

  try {
    await store.addPray(
      user.value,
      new Date(+year, +month - 1, +day),
      description.value
    );
  } catch (err) {
    $q.notify({
      message: "Błąd podczas zapisu do bazy",
      color: "negative",
      position: "top",
    });

    errorWhileSubmit = true;
  }

  if (!errorWhileSubmit) {
    description.value = "";
    user.value = "";
    user.value = auth.profile.id;

    emit("submit");
  }

  submitting.value = false;
};

onMounted(() => {
  user.value = auth.profile.id;
});
</script>
<style lang="scss">
.custom-flex {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
