<template>
  <Transition name="user-section" mode="out-in">
    <div class="row" v-if="!showAddNew">
      <ProfilePickerSelect
        :emit-value="props.emitValue"
        :label="props.label"
        v-model:profile="profileModel"
        @hide-component="showOrHideAddNewPanel"
      />
    </div>
    <template v-else>
      <ProfilePickerAddNew
        class="row"
        @add-profile="updateProfileHandler"
        @close="showOrHideAddNewPanel"
        :emit-value="props.emitValue"
      />
    </template>
  </Transition>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, onMounted } from "vue";
import ProfilePickerSelect from "./ProfilePickerSelect.vue";
import ProfilePickerAddNew from "./ProfileSelectAddNew.vue";

const props = defineProps({
  label: { type: String, default: "W czyjej intencji?" },
  profile: { type: String, default: "" },
  suggest: { type: String, default: "" },
  emitValue: { type: Boolean, default: false },
});
const emit = defineEmits(["update:profile", "edit-mode"]);

const showAddNew = ref(false);
const newUserName = ref("");

const updateProfileHandler = (val: string | Record<string, unknown>) => {
  showAddNew.value = false;

  emit("update:profile", val);
};

const showOrHideAddNewPanel = () => {
  showAddNew.value = !showAddNew.value;

  emit("edit-mode", showAddNew.value);
};

const profileModel = computed({
  get() {
    return props.profile;
  },
  set(value) {
    emit("update:profile", value);
  },
});

onMounted(() => {
  newUserName.value = props.suggest;
});
</script>
<style lang="scss" scoped>
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
