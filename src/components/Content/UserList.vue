<template>
  <form @submit.prevent="onSubmitHandler">
    <ul>
      <li v-for="user in listOfUsers" :key="user.id" class="row even">
        <q-field label="Nazwa" stack-label class="col-xs-12 col-md-2 " >
          <template v-slot:control>
            <div class="self-center no-outline" tabindex="0">
              {{ user.name }}
            </div>
          </template>
        </q-field>
        <q-field label="Email" stack-label class="col-xs-12 col-md-3 ">
          <template v-slot:control>
            <div class="self-center no-outline" tabindex="0">
              {{ user.email }}
            </div>
          </template>
        </q-field>
        <q-select
          clearable
          :model-value="user.profile?.id || null"
          @update:model-value="
            (el) => {
              updateSelect(user.id, el);
            }
          "
          :options="profileOptions"
          map-options
          label="Profil"
          class="col-md-3 col-xs-12"
        />

        <q-select
          @update:model-value="(v)=>updateUser(user.id,{'role':v} as User)"
          :model-value="user.role"
          :options="roleOptions"
          label="Rola"
          class="col-md-2 col-xs-7"
          :disable="auth.role != 'superadmin' || !user.role"
        />
        <q-checkbox
          @update:model-value="(v)=>updateUser(user.id, {role:v?'user':''} as User)"
          :model-value="user.role != ''"
          label="Aktywny"
          color="teal"
          class="col-md-1 col-xs-4"
        />
      </li>
    </ul>
    <q-btn
      type="submit"
      color="teal"
      class="fixed-bottom-left full-width"
      label="zapisz"
    />
  </form>
</template>
<script setup lang="ts">
import { useAdminStore } from "@/store/admin";
import { User, Profile } from "@/@types/database";
import { onMounted, ref, computed } from "vue";
import { useStore } from "@/store";
import { useAuth } from "@/store/auth";

const store = useStore();
const auth = useAuth();

const adminStore = useAdminStore();
const updateList = ref([] as User[]);
const listOfUsers = ref([] as User[]);

const updateSelect = (
  id: string,
  selectValue: { label: string; value: string }
) => {
  if (!selectValue) {
    updateUser(id, { profile: { name: "", id: "" } } as User);
  }
  const profile = { name: selectValue.label, id: selectValue.value } as Profile;
  updateUser(id, { profile } as User);
};

const updateUser = (id: string, user: User) => {
  let findUser = updateList.value.find((el) => el.id == id);
  let findUserData = listOfUsers.value.find((el) => el.id == id);

  if (!findUser) {
    findUser = { id } as User;
    updateList.value.push(findUser);
  }

  for (const [key, value] of Object.entries(user)) {
    //@ts-ignore
    findUser[key] = value;
    //@ts-ignore
    findUserData[key] = value;
  }
};

const onSubmitHandler = async () => {
  if (!Object.keys(updateList.value).length) {
    return;
  }
  await adminStore.updateListOfUsers(updateList.value);
};

onMounted(async () => {
  await adminStore.getUserList();
  listOfUsers.value = adminStore.users;
});

const profileOptions = computed(() => {
  type Options = { label: string; value: string };
  const listOfProfiles: Options[] = [];
  const profiles = store.users;

  for (const k of Object.keys(profiles)) {
    listOfProfiles.push({ label: profiles[k].name, value: profiles[k].id });
  }

  return listOfProfiles;
});

const roleOptions = ["user", "admin", "superadmin"];
</script>
<style scoped lang="scss">
form {
  padding: 0 0.5rem;
}
ul {
  list-style: none;
  padding: 0 0 3rem;
}

.row{
  gap: 0.5rem;
  margin-bottom: 0.3rem;
}

.even:nth-child(even){
 background-color: lighten($blue-grey-1,3%);
}
</style>
