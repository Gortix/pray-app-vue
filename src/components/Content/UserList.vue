<template>
  <div class="content">
    <Transition>
      <UserListFilterPanes
        v-if="renderSearchPanel"
        v-model:search-text="searchText"
      />
    </Transition>
    <form @submit.prevent="onSubmitHandler">
      <ul>
        <TransitionGroup>
          <li
            v-for="user in sortedListOfUsers"
            :key="user.id"
            class="row even gap"
          >
            <q-field label="Nazwa" stack-label class="col">
              <template v-slot:control>
                <div class="self-center no-outline" tabindex="0">
                  {{ user.name }}
                </div>
              </template>
            </q-field>
            <q-field label="Email" stack-label class="col">
              <template v-slot:control>
                <div class="self-center no-outline" tabindex="0">
                  {{ user.email }}
                </div>
              </template>
            </q-field>
            <ProfileSelect
              class="col-md-3 col-xs-12"
              label="Profil"
              :profile="user.profile?.id"
              :suggest="user.name"
              @update:profile="
                (el) => {
                  updateSelect(user.id, el);
                }
              "
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
        </TransitionGroup>
      </ul>
      <q-btn
        type="submit"
        color="teal"
        class="fixed-bottom-left full-width"
        label="zapisz"
      />
    </form>
  </div>
</template>
<script setup lang="ts">
import { useAdminStore } from "@/store/admin";
import { User, Profile } from "@/@types/database";
import { onMounted, ref, computed, watch } from "vue";
import { useAuth } from "@/store/auth";
import ProfileSelect from "../ProfileSelect.vue";
import UserListFilterPanes from "../FilterPanels/UserListFilterPanes.vue";

const auth = useAuth();

const adminStore = useAdminStore();
const updateList = ref([] as User[]);
const listOfUsers = ref([] as User[]);
const renderSearchPanel = ref(false);
const searchText = ref("");

const sortedListOfUsers = computed(() => {
  let newList = [...listOfUsers.value];

  newList.sort((prev, current) => {
    if (current.role && !prev.role) {
      return -1;
    }
    if (!current.role && prev.role) {
      return 1;
    }
    current.role && prev.role ? 0 : !current.role && prev.role ? -1 : 1;
    return 0;
  });

  return searchText.value.length > 2
    ? newList.filter(
        (el) =>
          el.name.toLocaleLowerCase().includes(searchText.value) ||
          (el?.email || "").includes(searchText.value)
      )
    : newList;
});

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

watch(listOfUsers, (val) => {  
  renderSearchPanel.value = !!val.length;
});

const roleOptions = ["user", "admin", "superadmin"];
</script>
<style scoped lang="scss">
.content {
  padding: 0 0.5rem;
}

ul {
  list-style: none;
  padding: 0 0 3rem;
}

.gap {
  gap: 0.5rem;
  margin-bottom: 0.3rem;
}

.even:nth-child(even) {
  background-color: lighten($blue-grey-1, 3%);
}

.v-move,
.v-active,
.v-leave-active {
  transition: all 0.3s;
}

.v-enter-from, .v-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translatey(-100%);
  position: absolute;
}
</style>
