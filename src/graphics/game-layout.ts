import { createHead } from '@vueuse/head';
import { createApp } from 'vue';
import App from './game-layout/main.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import * as Layouts from './game-layout/layouts';

const routes = [
  {
    name: '3x2 - 1 Player',
    path: '/3x2-1p',
    component: Layouts.L_4x3_1p,
  },
  {
    name: '4x3 - 1 Player',
    path: '/4x3-1p',
    component: Layouts.L_4x3_1p,
  },
  {
    name: '4x3 - 2 Players',
    path: '/4x3-2p',
    component: Layouts.L_4x3_2p,
  },
  {
    name: '4x3 - 3 Players',
    path: '/4x3-3p',
    component: Layouts.L_4x3_3p,
  },
  {
    name: '4x3 - Bingo',
    path: '/4x3-bingo',
    component: Layouts.L_4x3_Bingo,
  },
  {
    name: '16x9 - 1 Player',
    path: '/16x9-1p',
    component: Layouts.L_16x9_1p,
  },
  {
    name: '16x9 - 2 Players',
    path: '/16x9-2p',
    component: Layouts.L_16x9_2p,
  },
  {
    name: '16x9 - 3 Players',
    path: '/16x9-3p',
    component: Layouts.L_16x9_3p,
  },
  {
    name: '16x9 - 4 Players',
    path: '/16x9-4p',
    component: Layouts.L_16x9_4p,
  },
  {
    name: '16x9 - Bingo',
    path: '/16x9-bingo',
    component: Layouts.L_16x9_Bingo,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App);
const head = createHead();
app.use(router);
app.use(head);
app.mount('#app');
