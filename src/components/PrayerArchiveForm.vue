<template>
  <form @submit.prevent="handleSubmit" class="custom-flex">
    <!-- TODO: pole Daty -->
    <q-input v-model="archiveDate" label="Data archiwizacji" />
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
import { ref, computed, defineEmits, onMounted } from "vue";
import { useQuasar } from "quasar";
import { Pray } from "@/@types/database";
import { dateToString } from "@/functions/helpers";

const $q = useQuasar();

const props = defineProps<{ data: Pray }>();
const emit = defineEmits(["submit"]);

const archiveChecked = ref(false);
const archiveDescription = ref("");
const archiveDate = ref("");

const editMode = computed(() => {
  return props.data?.description.length || 0 > 0;
});

const submitting = ref(false);

const handleSubmit = async () => {
  if (archiveChecked.value) {
    if (!archiveDate.value || !archiveDescription.value) {
      $q.notify({
        message: "Uzupełnij wszystkie pola",
        color: "negative",
        textColor: "white",
        position: "top",
      });

      return;
    }

    // tutaj dodaj kod, który zapisuje pola do bazy danych
    // np. za pomocą metody `store.updatePray`

    archiveChecked.value = false;
    archiveDate.value = "";
    archiveDescription.value = "";
  }

  emit("submit");
};

onMounted(() => {
  if (props.data) {
    archiveDate.value = dateToString(new Date());
    // tutaj wpisz kod, który pobiera wartości pól z bazy danych
    // i przypisuje je do zmiennych `archiveDescription` i `archiveDate`
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
