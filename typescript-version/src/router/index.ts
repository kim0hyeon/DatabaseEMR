import { createRouter, createWebHistory } from 'vue-router';
import ChartView from '../pages/chart.vue';
import LoginView from '../pages/login.vue';
import CostView from '../pages/tables.vue';
const basicRoute = ref('');

if(sessionStorage.getItem('token')){
  basicRoute.value = '/dashboard'
}else{
  basicRoute.value = '/login'
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes:  [
    { path: '/', redirect: basicRoute.value },
    {
      path: '/',
      component: () => import('../layouts/default.vue'),
      children: [
        {
          path: 'dashboard',name: 'dashboard',
          component: () => import('../pages/dashboard.vue'),
          meta: {
            requiresAuth: true  // 인증이 필요한 경로일 경우 설정
          }
        },
        {
          path: 'patient-registration',name: 'patient-registration',
          component: () => import('../pages/PatientRegistration.vue'),
          meta: {
            requiresAuth: true  // 인증이 필요한 경로일 경우 설정
          }
        },
        {
          path: 'examination',name: 'examination',
          component: () => import('../pages/examination.vue'),
          meta: {
            requiresAuth: true  // 인증이 필요한 경로일 경우 설정
          }
        },
        {
          path: 'typography',
          component: () => import('../pages/typography.vue'),
          meta: {
            requiresAuth: true  // 인증이 필요한 경로일 경우 설정
          }
        },
        {
          path: 'icons',
          component: () => import('../pages/icons.vue'),
          meta: {
            requiresAuth: true  // 인증이 필요한 경로일 경우 설정
          }
        },
        {
          path: 'cards',
          component: () => import('../pages/cards.vue'),
          meta: {
            requiresAuth: true  // 인증이 필요한 경로일 경우 설정
          }
        },
        { path: '/cost', component: CostView, name: 'cost' ,meta: {
          requiresAuth: true  // 인증이 필요한 경로일 경우 설정
        }},
        {
          path: 'form-layouts',
          component: () => import('../pages/form-layouts.vue'),
          meta: {
            requiresAuth: true  // 인증이 필요한 경로일 경우 설정
          }
        },
        
        {path: '/chart',component: ChartView,name: 'chart',meta: {
          requiresAuth: true  // 인증이 필요한 경로일 경우 설정
        }},
        {
          path: 'physiotherapy',name: 'physiotherapy',
          component : () => import('../pages/physiotherapy.vue'),
          meta: {
            requiresAuth: true  // 인증이 필요한 경로일 경우 설정
          }
        },
        {
          path : 'statistics',name : 'statistics',
          component : () => import('../pages/statistics.vue'),
          meta: {
            requiresAuth: true  // 인증이 필요한 경로일 경우 설정
          }
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
});
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !token) {
    // 토큰이 없으면 로그인 페이지로 리디렉션
    next('/login');
  } else {
    // 토큰이 있거나 인증이 필요하지 않은 페이지인 경우 계속 진행
    next();
  }
});

export default router
