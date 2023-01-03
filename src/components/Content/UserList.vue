<template>
  <ul>
    <li v-for="user in listOfUsers" :key="user.id" class="row">
      <q-field label="Nazwa" stack-label class="col">
        <template v-slot:control>
          <div class="self-center no-outline" tabindex="0">
            {{ user.name }}
          </div>
        </template>
      </q-field>
      <q-select
        :model-value="user.profile.id"
        @update:model-value="
          (el) => {
            updateSelect(user.id, el);
          }
        "
        :options="options"
        map-options
        label="Profil"
        class="col-3"
      />

      <q-input
        @update:model-value="(v)=>updateUser(user.id,{'role':v} as User)"
        :model-value="user.role"
        label="Rola"
        class="col-2"
        disable
      />
      <q-checkbox
        @update:model-value="(v)=>updateUser(user.id, {role:v?'user':''} as User)"
        :model-value="user.role != ''"
        label="Aktywny"
        color="teal"
        class="col-1"
      />
    </li>
  </ul>
</template>
<script setup lang="ts">
import { useAdminStore } from "@/store/admin";
import { User, Profile } from "@/@types/database";
import { onMounted, ref, computed } from "vue";
import { useStore } from "@/store";
import { DocumentReference } from "@firebase/firestore";

const store = useStore();

const adminStore = useAdminStore();
const updateList = ref([] as User[]);
const listOfUsers = ref([] as User[]);

const updateSelect = (
  id: string,
  selectValue: { label: string; value: string }
) => {
  const profile = { name: selectValue.label, id: selectValue.value } as Profile;
  updateUser(id, { profile } as User);
};

const updateUser = (id: string, user: User) => {
  let findUser = updateList.value.find((el) => el.id == id);
  let findUserData = listOfUsers.value.find((el) => el.id == id);

  if (!findUser) {
    findUser = { id: user.id } as User;
    updateList.value.push(findUser);
  }

  for (const [key, value] of Object.entries(user)) {
    //@ts-ignore
    findUser[key] = value;
    //@ts-ignore
    findUserData[key] = value;
  }
};

onMounted(async () => {
  await adminStore.getUserList();
  listOfUsers.value = adminStore.users;
});

const options = computed(() => {
  type Options = { label: string; value: string };
  const listOfProfiles: Options[] = [];
  const profiles = store.users;

  for (const k of Object.keys(profiles)) {
    listOfProfiles.push({ label: profiles[k].name, value: profiles[k].id });
  }

  return listOfProfiles;
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
