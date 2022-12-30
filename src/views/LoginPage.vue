<template>
  <q-btn class="fixed-center" size="lg" @click="()=>auth.authorize()">
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
      alt="google icon"
      style="padding-right: 1rem;"
    />
       Zaloguj
  </q-btn>
</template>
<script setup lang="ts">
import { useAuth } from "@/store/auth";

const auth = useAuth();
</script>
