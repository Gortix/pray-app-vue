<template>
  <Transition name="user-section" mode="out-in">
    <div class="row" v-if="!showAddNew">
      <ProfilePickerSelect
        :emit-value="props.emitValue"
        :label="props.label"
        v-model:profile="profileModel"
        @hide-component="showAddNew = !showAddNew"
      />
    </div>
    <template v-else>
      <ProfilePickerAddNew
        class="row"
        @add-profile="updateProfileHandler"
        @close="showAddNew = !showAddNew"
        :emit-value="props.emitValue"
      />
    </template>
  </Transition>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch, defineAsyncComponent } from "vue";
const ProfilePickerSelect = defineAsyncComponent(() => import("./ProfilePickerSelect.vue"));
const ProfilePickerAddNew = defineAsyncComponent(() => import("./ProfileSelectAddNew.vue"));

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
  emit("update:profile", val);

  showAddNew.value = false;
};

const profileModel = computed({
  get() {
    return props.profile;
  },
  set(value) {
    emit("update:profile", value);
  },
});

watch(showAddNew, (val) => {
  emit("edit-mode", val);
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
