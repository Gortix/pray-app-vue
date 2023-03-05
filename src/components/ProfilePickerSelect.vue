<template>
  <q-select
    ref="quasarSelect"
    @popup-hide="updateDisplayPopupValue"
    @popup-show="updateDisplayPopupValue"
    :error="!user"
    class="col"
    v-model="user"
    :options="options"
    popup-content-class="dropdown-popup"
    map-options
    use-input
    :emit-value="props.emitValue"
    @filter="selectFilter"
    :label="props.label"
    style="padding-bottom:0"
  >
    <template #append>
      <q-icon
        v-if="displayPopup"
        name="o_close"
        color="red"
        class="cursor-pointer"
        @click="quasarSelect?.hidePopup"
      />
    </template>
    <template #after>
      <q-btn
        type="button"
        @click="() => emit('hide-component')"
        flat
        class="full-height"
        color="positive"
      >
        <span style="font-size: 1.3rem"> &#43;</span>
      </q-btn>
    </template>
  </q-select>
</template>
<script setup lang="ts">
import { useStore, Options } from "@/store";
import { QSelect, Platform } from "quasar";
import { defineProps, defineEmits, ref, computed, watch, onMounted } from "vue";

const props = defineProps({
  label: { type: String, default: "" },
  profile: { type: String, default: "" },
  emitValue: { type: Boolean, default: false },
});
const emit = defineEmits(["update:profile", "hide-component"]);

const store = useStore();

const quasarSelect = ref<QSelect>();

const displayPopup = ref<boolean>(false);
const options = ref([{}] as Options[]);

const user = computed({
  get() {
    return props.profile;
  },
  set(profile) {
    emit("update:profile", profile);
  },
});

const updateDisplayPopupValue = () => {
  if (Platform.is.mobile) displayPopup.value = !displayPopup.value;
};

const selectFilter = (val: string, update: (fn: () => void) => void) => {
  if (!val) {
    return update(() => {
      options.value = store.getProfileOptions;
    });
  }

  const valLowerCase = val.toLowerCase();
  update(() => {
    options.value = store.getProfileOptions.filter((el) =>
      el.label.toLowerCase().includes(valLowerCase)
    );
  });
};

watch(
  () => store.getProfileOptions,
  (val) => {
    options.value = val;
  }
);

onMounted(() => {
  options.value = store.getProfileOptions;
});
</script>
<style lang="scss" scoped>
.dropdown-popup {
  border-left: 4px solid $light-blue-11;
}
</style>
