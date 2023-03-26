import { createHead } from '@vueuse/head';
import vuetify from '../plugins/vuetify';
import { createApp } from 'vue';
import App from './streamAssign/main.vue';

const head = createHead();
createApp(App).use(vuetify).use(head).mount('#app');
