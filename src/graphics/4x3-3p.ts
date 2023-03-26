import { createHead } from '@vueuse/head';
import { createApp } from 'vue';
import App from './4x3-3p/main.vue';

const app = createApp(App);
const head = createHead();
app.use(head);
app.mount('#app');
