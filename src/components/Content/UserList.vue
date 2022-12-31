<template>
  <ul>
    <li v-for="user in adminStore.users" :key="user.id" class="row">
      <q-field label="Nazwa" stack-label class="col">
        <template v-slot:control>
          <div class="self-center no-outline" tabindex="0">
            {{ user.name }}
          </div>
        </template>
      </q-field>
      <q-select
        v-model="user.profile.id"
        :options="options"
        emit-value
        map-options
        label="Profil"
        class="col-3"
      />

      <q-input :model-value="user.role" label="Rola" class="col-2" disable />
      <q-checkbox v-model="teal" label="Aktywny" color="teal" class="col-1" />
    </li>
  </ul>
</template>
<script setup lang="ts">
import { useAdminStore } from "@/store/admin";
import { User } from "@/@types/database";
import { onMounted, ref, computed } from "vue";
import { useStore } from "@/store";

const store = useStore();

const adminStore = useAdminStore();
const updateList = ref([] as { id: string }[]);

const updateUser = (user: User) => {
  let findUser = updateList.value.find((el) => el.id == user.id);
  if (!findUser) {
    findUser = { id: user.id };
    updateList.value.push(findUser);
  }
};

onMounted(async () => {
  await adminStore.getUserList();
});

const options = computed(() => {
  type Options = { label: string; value: string };
  const listOfUsers: Options[] = [];
  const users = store.users;

  for (const k of Object.keys(users)) {
    listOfUsers.push({ label: users[k].name, value: users[k].id });
  }

  return listOfUsers;
});
</script>
<style scoped lang="scss">
ul {
  list-style: none;
  padding: 0 0.5rem;
}

.row {
  gap: 0.5rem;
  margin-bottom: 0.3rem;
}
</style>
