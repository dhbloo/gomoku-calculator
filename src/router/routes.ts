import { RouteRecordRaw } from 'vue-router';
import MainLayout from 'layouts/MainLayout.vue';
import BoardPage from 'src/pages/BoardPage.vue';
import SettingsPage from 'src/pages/SettingsPage.vue';
import AboutPage from 'src/pages/AboutPage.vue';

const mainRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'board',
    component: BoardPage,
  },
  {
    path: 'settings',
    name: 'settings',
    component: SettingsPage,
  },
  {
    path: 'about',
    name: 'about',
    component: AboutPage,
  },
];

const routes: RouteRecordRaw[] = [
  {
    path: '/:pos(.*)?',
    component: MainLayout,
    children: mainRoutes,
  },
];

export default routes;
