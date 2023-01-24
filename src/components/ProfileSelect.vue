<template>
  <Transition name="user-section" mode="out-in">
    <div class="row" v-if="!showAddNew">
      <q-select
        class="col"
        v-model="user"
        :options="options"
        popup-content-class="dropdown-popup"
        behavior="menu"
        map-options
        use-input
        :emit-value="props.emitValue"
        @filter="selectFilter"
        :label="props.label"
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
</template>
<script setup lang="ts">
import { useStore, Options } from "@/store";
import { useQuasar } from "quasar";
import { defineProps, defineEmits, ref, computed, onMounted, watch } from "vue";

const props = defineProps({
  label: { type: String, default: "W czyjej intencji?" },
  profile: { type: String, default: "" },
  suggest: { type: String, default: "" },
  emitValue: { type: Boolean, default: false },
});
const emit = defineEmits(["update:profile", "edit-mode"]);

const store = useStore();
const $q = useQuasar();

const options = ref([{}] as Options[]);
const showAddNew = ref(false);
const newUserName = ref("");

const user = computed({
  get() {
    return props.profile;
  },
  set(profile) {
    emit("update:profile", profile);
  },
});

const selectFilter = (val: string, update: (fn: () => void) => void) => {
  if (!val) {
    update(() => {
      options.value = store.getProfileOptions;
    });

    return;
  }
  update(() => {
    options.value = store.getProfileOptions.filter((el) =>
      el.label.toLowerCase().includes(val.toLowerCase())
    );
  });
};

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
  emit(
    "update:profile",
    props.emitValue ? profileID : { label: newUserName.value, value: profileID }
  );
  newUserName.value = "";
  showAddNew.value = false;
};

watch(
  () => store.getProfileOptions,
  (val) => {
    options.value = val;
  }
);

watch(showAddNew, (val) => {
  emit("edit-mode", val);
});

onMounted(() => {
  options.value = store.getProfileOptions;
  newUserName.value = props.suggest;
});
</script>
<style lang="scss" scoped>
.dropdown-popup {
  border-left: 4px solid $light-blue-11;
}

.user-section-enter-active,
.user-section-leave-active {
  transition: all 0.25s ease-out;
  transform-origin: left;
}

.user-section-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}
.user-section-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
