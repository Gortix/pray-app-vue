<template>
  <form @submit.prevent="handleSubmit" class="custom-flex">
    <AppDateInput v-model="archiveDate" label="Data" />
    <q-input
      v-model="archiveDescription"
      type="textarea"
      label="Treść świadectwa"
    />

    <q-btn
      type="submit"
      :loading="submitting"
      label="Zapisz świadectwo"
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
import { ref, computed, onMounted } from "vue";
import { useStore } from "@/store/index";
import { useQuasar } from "quasar";
import { dateToString } from "@/functions/helpers";
import AppDateInput from "./AppDateInput.vue";
import { PrayBoxTypes } from "@/@types/components";

const $q = useQuasar();
const store = useStore();

const props = defineProps<{ data: PrayBoxTypes }>();
const emit = defineEmits(["submit"]);

const archiveDescription = ref("");
const archiveDate = ref(dateToString(new Date()));

//TODO: usunąć?
const editMode = computed(() => {
  return props.data?.description.length || 0 > 0;
});

const submitting = ref(false);

const handleSubmit = async () => {
  if (!props.data.id) return;

  const [day, month, year] = archiveDate.value.split(".");

  if (!archiveDate.value || archiveDescription.value.length < 4) {
    $q.notify({
      message: "Uzupełnij wszystkie pola",
      color: "negative",
      textColor: "white",
      position: "top",
    });

    return;
  }

  store.archivePrayer(props.data.id, {
    archive_date: new Date(+year, +month - 1, +day),
    archive_description: archiveDescription.value,
  });
  // tutaj dodaj kod, który zapisuje pola do bazy danych
  // np. za pomocą metody `store.updatePray`

  archiveDate.value = "";
  archiveDescription.value = "";

  emit("submit");
};

onMounted(() => {
  if (props.data) {
    archiveDate.value = dateToString(new Date());
  }

  if (props.data.archive_description) {
    console.log(props.data.archive_description);

    archiveDescription.value = props.data.archive_description;
  }
});
</script>

<style lang="scss" scoped>
.custom-flex {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
