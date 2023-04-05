<template>
  <form @submit.prevent="handleSubmit" class="custom-flex">
    <SelectProfile
      v-model:profile="user"
      emit-value
      @edit-mode="(edited) => (showAddNew = edited)"
    />

    <AppDateInput
      v-if="['admin', 'superadmin'].includes(auth.role)"
      v-model="date"
      label="Data zgłoszenia"
    />

    <q-input v-model="description" type="textarea" label="Treść modlitwy:" />
    <q-btn
      type="submit"
      :loading="submitting"
      :label="editMode ? 'Aktualizuj modlitwę' : 'Proszę o modlitwę'"
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
import { ref, onMounted } from "vue";
import { useAuth } from "@/store/auth";
import { Pray } from "@/@types/database";
import { dateToString } from "@/functions/helpers";
import { useQuasar } from "quasar";
import SelectProfile from "./ProfilePicker.vue";
import AppDateInput from "./AppDateInput.vue";

const props = defineProps<{ data?: Pray }>();

const store = useStore();
const auth = useAuth();
const $q = useQuasar();

const emit = defineEmits(["submit"]);

const description = ref("");
const user = ref("");
const date = ref(dateToString(new Date()));
const showAddNew = ref(false);
const submitting = ref(false);

const editMode = computed(() => {
  return props.data?.description.length || 0 > 0;
});

const notify = (message: string, color: string, textColor = "white") => {
  $q.notify({
    message,
    color,
    textColor,
    position: "top",
  });
};

const updatePray = (date: Date) => {
  if (!props.data?.id) {
    return;
  }

  store.updatePray(props.data.id, {
    description: description.value,
    owner: user.value,
    date,
  });
};

const addPray = async (date: Date) => {
  await store.addPray(user.value, date, description.value);
};

const handleSubmit = async () => {
  const [day, month, year] = date.value.split(".");
  let errorWhileSubmit = false;
  submitting.value = true;

  if (showAddNew.value) {
    notify("Jesteś w trakcie dodawania nowej osoby", "warning", "black");

    return (submitting.value = false);
  }

  if (!date.value || !description.value || !user.value) {
    notify("Uzupełnij wszystkie pola", "negative");

    return (submitting.value = false);
  }

  if (editMode.value) {
    updatePray(new Date(+year, +month - 1, +day));
    submitting.value = false;

    return emit("submit");
  }

  try {
    await addPray(new Date(+year, +month - 1, +day));
  } catch (err) {
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

  if (!editMode.value || !props.data) return;

  user.value = props.data.owner.id;
  date.value = dateToString(props.data.date);
  description.value = props.data.description;
});
</script>
<style lang="scss" scoped>
.custom-flex {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
