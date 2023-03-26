import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/mdi-v6/mdi-v6.css';
import '@quasar/extras/roboto-font/roboto-font.css';
import { createHead } from '@vueuse/head';
import { Dark, Quasar } from 'quasar';
import 'quasar/dist/quasar.css';
import { createApp } from 'vue';
import App from './focus/main.vue';

const head = createHead();
createApp(App).use(Quasar, {}).use(head).mount('#app');
Dark.set(true)
