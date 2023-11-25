import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../pages/login.vue'
import TableView2 from '../pages/table2.vue'
import TableView from '../pages/tables.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes:  [
    { path: '/', redirect: '/dashboard' },
    {
      path: '/',
      component: () => import('../layouts/default.vue'),
      children: [
        {
          path: 'dashboard',
          component: () => import('../pages/dashboard.vue'),
        },
        {
          path: 'account-settings',
          component: () => import('../pages/account-settings.vue'),
        },
        {
          path: 'typography',
          component: () => import('../pages/typography.vue'),
        },
        {
          path: 'icons',
          component: () => import('../pages/icons.vue'),
        },
        {
          path: 'cards',
          component: () => import('../pages/cards.vue'),
        },
        { path: '/tables', component: TableView2, name: 'tables' },
        { path: '/tables/:id', component: TableView, name: 'tables-detail' },
        {
          path: 'form-layouts',
          component: () => import('../pages/form-layouts.vue'),
        },
        {path: '/login',component: LoginView,name: 'login'},
        {path: '/login/:id',component: LoginView,name: 'login-detail'},
        {
          path: 'physiotherapy',
          component : () => import('../pages/physiotherapy.vue'),
        },
        {
          path : 'statistics',
          component : () => import('../pages/statistics.vue'),
        }
      ],
    },
    {
      path: '/',
      component: () => import('../layouts/blank.vue'),
      children: [
        {
          path: 'register',
          component: () => import('../pages/register.vue'),
        },
        {
          path: '/:pathMatch(.*)*',
          component: () => import('../pages/[...all].vue'),
        },
      ],
    },
  ],
})


export default router
