<template>
  <form @submit.prevent="simulateSubmit" class="custom-flex">
    <Transition name="user-section" mode="out-in">
      <div class="row" v-if="!showAddNew">
        <q-select
          class="col"
          v-model="user"
          :options="store.getProfileOptions"
          emit-value
          map-options
          label="Osoba"
        />
        <q-btn
          type="button"
          @click="showAddNew = !showAddNew"
          flat
          color="positive"
        >
          <span style="font-size: 1.3rem"> &#43;</span>
        </q-btn>
      </div>
      <div class="row" v-else>
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
          @click="showAddNew = !showAddNew"
          flat
          color="negative"
          label="&#10005;"
        />
      </div>
    </Transition>

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
import { ref, defineEmits, onMounted, defineProps } from "vue";
import { useAuth } from "@/store/auth";
import { Pray } from "@/@types/database";
import { dateToString } from "@/functions/helpers";
import { useQuasar} from "quasar";

const props = defineProps<{ data?: Pray }>();

const datePattern = /^[0-3]\d.[0-1]\d.[\d]{4}$/;
const d = new Date();

const store = useStore();
const auth = useAuth();
const $q = useQuasar();

const emit = defineEmits(["submit"]);

const description = ref("");
const user = ref("");
const date = ref(dateToString(new Date()));
const newUserName = ref("");
const showAddNew = ref(false);
const submitting = ref(false);

const editMode = computed(() => {
  return props.data?.description.length || 0 > 0;
});

const addNewProfile = async () => {
  newUserName.value = newUserName.value.trim();
  if (!newUserName.value) {
    $q.notify({
      message: "Podaj imię i nazwisko",
      color: "warning",
      textColor: "black",
      position: "top",
    });

    return;
  }

  if (store.getProfileOptions.find((el) => el.label == newUserName.value)) {
    $q.notify({
      message: "Taki użytkownik już istnieje",
      color: "warning",
      textColor: "black",
      position: "top",
    });

    return;
  }

  const profileID = (await store.addProfile(newUserName.value)) as string;
  user.value = profileID;
  newUserName.value = "";
  showAddNew.value = false;
};

const simulateSubmit = async () => {
  if (showAddNew.value) {
    $q.notify({
      message: "Jesteś w trakcie dodawania nowej osoby",
      color: "warning",
      textColor: "black",
      position: "top",
    });
    submitting.value = false;

    return;
  }

  if (!date.value || !description.value || !user.value) {
    $q.notify({
      message: "Uzupełnij wszystkie pola",
      color: "negative",
      position: "top",
    });
    submitting.value = false;

    return;
  }

  const [day, month, year] = date.value.split(".");
  let errorWhileSubmit = false;
  submitting.value = true;
  showAddNew.value = false;

  if (editMode.value) {
    store.updatePray(props.data?.id || "", {
      description: description.value,
      owner: user.value,
      date: new Date(+year, +month - 1, +day),
    });

    submitting.value = false;
    emit("submit");

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
  if (editMode.value) {
    description.value = props.data?.description || "";
    //@ts-ignore
    user.value = props.data?.owner.id;
    //@ts-ignore
    date.value = dateToString(props.data?.date);
  }
});
</script>
<style lang="scss">
.custom-flex {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.user-section-enter-active,
.user-section-leave-active {
  transition: all 0.3s ease-out;
}

.user-section-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.user-section-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
