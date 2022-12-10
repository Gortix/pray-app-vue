<template>
  <q-btn
    class="fixed-center"
    size="lg"
    @click="authAndRefresh"
    color="primary"
    label="Zaloguj się do aplikacji modlitewnej"
  />
</template>
<script setup lang="ts">
import { defineEmits } from 'vue';

const emit = defineEmits(["login"]);

const authAndRefresh = async (ev: Event) => {
  emit("login", ev);
};
</script>
