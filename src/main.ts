import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from './App.vue'
import { Quasar } from 'quasar'

// eslint-disable-next-line
// @ts-ignore
import quasarUserOptions from './quasar-user-options'

import router from './router'

createApp(App).use(router).use(createPinia()).use(Quasar, quasarUserOptions).mount('#app')
