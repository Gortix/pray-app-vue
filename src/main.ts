import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from './App.vue'
import { Quasar } from 'quasar'
// eslint-disable-next-line
// @ts-ignore
import quasarUserOptions from './quasar-user-options'

createApp(App).use(createPinia()).use(Quasar, quasarUserOptions).mount('#app')
