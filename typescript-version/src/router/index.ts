import { createRouter, createWebHistory } from 'vue-router'
import ChartView from '../pages/chart.vue'
import LoginView from '../pages/login.vue'
import CostView2 from '../pages/table2.vue'
import CostView from '../pages/tables.vue'
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
          path: 'examination',
          component: () => import('../pages/examination.vue'),
        },
        {
          path: 'patient-register',
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
        { path: '/cost', component: CostView2, name: 'cost' },
        { path: '/cost/:id', component: CostView, name: 'cost-detail' },
        {
          path: 'form-layouts',
          component: () => import('../pages/form-layouts.vue'),
        },
        
        {path: '/chart',component: ChartView,name: 'chart'},
        {path: '/chart/:id',component: ChartView,name: 'chart-detail'},
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
        {path: '/login',component: LoginView,name: 'login'},
        {
          path: '/:pathMatch(.*)*',
          component: () => import('../pages/[...all].vue'),
        },
      ],
    },
  ],
})


export default router
