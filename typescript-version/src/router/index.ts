import { createRouter, createWebHistory } from 'vue-router'
import ChartView from '../pages/chart.vue'
import LoginView from '../pages/login.vue'
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
          path: 'dashboard',name: 'dashboard',
          component: () => import('../pages/dashboard.vue'),
        },
        {
          path: 'patient-registration',name: 'patient-registration',
          component: () => import('../pages/PatientRegistration.vue'),
        },
        {
          path: 'examination',name: 'examination',
          component: () => import('../pages/examination.vue'),
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
        { path: '/cost', component: CostView, name: 'cost' },
        {
          path: 'form-layouts',
          component: () => import('../pages/form-layouts.vue'),
        },
        
        {path: '/chart',component: ChartView,name: 'chart'},
        {
          path: 'physiotherapy',name: 'physiotherapy',
          component : () => import('../pages/physiotherapy.vue'),
        },
        {
          path : 'statistics',name : 'statistics',
          component : () => import('../pages/statistics.vue'),
        }
      ],
    },
    {
      path: '/',
      component: () => import('../layouts/blank.vue'),
      children: [
        {
          path: 'register',name: 'register',
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
