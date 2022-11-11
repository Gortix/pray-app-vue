<template>
  <q-dialog
    :model-value="modelValue"
    @show="$emit('update:modelValue', true)"
    @hide="$emit('update:modelValue', false)"
  >
    <q-card>
      <q-toolbar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
        </q-avatar>

        <q-toolbar-title
          ><span class="text-weight-bold">Quasar</span>
          Framework</q-toolbar-title
        >

        <q-btn flat round dense v-close-popup>&#x2715;</q-btn>
      </q-toolbar>

      <q-card-section>
        <form @submit.prevent="simulateSubmit" class="q-pa-md">
          <q-input
            v-model="description"
            clearable
            type="textarea"
            color="teal"  
            label="Jakiej modlitwy potrzebujesz?"
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
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";

const description = ref("");
const submitting = ref(false);

const props = defineProps({ modelValue: Boolean });
const emits = defineEmits(["update:modelValue"]);

const simulateSubmit= ()=>{
    submitting.value = true;

    submitting.value= false;
}
</script>
