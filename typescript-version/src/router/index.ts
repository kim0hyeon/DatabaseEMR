import { useUserStore } from '@/store';
import { createRouter, createWebHistory } from 'vue-router';
import PhotoView from '../pages/ImageViewer.vue';
import ChartView from '../pages/chart.vue';
import LoginView from '../pages/login.vue';
import CostView from '../pages/cost.vue';
const basicRoute = ref('');
// const loginStore = useUserStore(); 왠지 모르겠는데 이거하면 주석없애면 로드 안됌 
basicRoute.value = '/login'
if(sessionStorage.getItem('token')){
  basicRoute.value = '/home'
}
// console.log(basicRoute.value)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes:  [
    { path: '/', redirect: basicRoute.value },
    {
      path: '/',
      component: () => import('../layouts/default.vue'),
      children: [
        {
          path: 'home',name: 'home',
          component: () => import('../pages/home.vue'),
          meta: {
            requiresAuth: true, // 인증이 필요한 경로일 경우 설정
            jobAuth: [1,1,1,1] // [의사,간호사,물리치료사,방사선사]
          }
        },
        {
          path: 'patient-registration',name: 'patient-registration',
          component: () => import('../pages/PatientRegistration.vue'),
          meta: {
            requiresAuth: true,  // 인증이 필요한 경로일 경우 설정
            jobAuth: [1,1,0,0] // 의사 간호사만 
          }
        },
        {
          path: 'examination',name: 'examination',
          component: () => import('../pages/examination.vue'),
          meta: {
            requiresAuth: true,  // 인증이 필요한 경로일 경우 설정
            jobAuth: [1,1,0,1] // 의사 간호사 방사선사만 
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
          path: 'admin',
          name: 'admin',
          component: () => import('../pages/admin.vue'),
          meta: {
            requiresAuth: true,  // 인증이 필요한 경로일 경우 설정
            jobAuth: [0,0,0,0]
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
          requiresAuth: true,  // 인증이 필요한 경로일 경우 설정
          jobAuth: [1,1,0,0] // 의사 간호사만 
        }},
        {
          path: 'form-layouts',
          component: () => import('../pages/form-layouts.vue'),
          meta: {
            requiresAuth: true  // 인증이 필요한 경로일 경우 설정
          }
        },
        
        {path: '/chart',component: ChartView,name: 'chart',meta: {
          requiresAuth: true,  // 인증이 필요한 경로일 경우 설정
          jobAuth: [1,1,0,0] // 의사 간호사만 
        }},
        {
          path: '/physiotherapy',name: 'physiotherapy',
          component : () => import('../pages/physiotherapy.vue'),
          meta: {
            requiresAuth: true,  // 인증이 필요한 경로일 경우 설정
            jobAuth: [1,1,1,0] // 의사 간호사 물리치료사만 
          }
        },
        {
          path : '/statistics',name : 'statistics',
          component : () => import('../pages/statistics.vue'),
          meta: {
            requiresAuth: true , // 인증이 필요한 경로일 경우 설정
            jobAuth: [1,1,0,0] // 의사 간호사만 
          }
        },
        {
          path: '/reservation', name: 'reservation',
          component : () => import('../pages/reservation.vue'),
          meta: {
            requiresAuth: true, // 인증이 필요한 경로일 경우 설정
            jobAuth: [1,1,0,0] // 의사 간호사만
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
          meta: {
            requiresAuth: false , // 인증이 필요한 경로일 경우 설정
            jobAuth: [0,0,0,0]  
          },
        },
        {
          path: '/login',component: LoginView,name: 'login',
        meta: {
          requiresAuth: false , // 인증이 필요한 경로일 경우 설정
          jobAuth: [0,0,0,0] // 의사 간호사만 
        }},
        {
          path: '/files',name: 'files',
          component : PhotoView,
          meta: {
            requiresAuth: true,  // 인증이 필요한 경로일 경우 설정
            jobAuth: [1,1,,0] // 의사 간호사 물리치료사만 
          }
        },
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
  }else {
    // 토큰이 있거나 인증이 필요하지 않은 페이지인 경우 계속 진행
    //페이지 부를때마다 사용자 정보 부르기 
    useUserStore().getAccountInfo();  //10410
    // 0번이 의사, 1번이 간호사, 2번이 물리치료사, 3번이 방사선사 
    // 권한에 따라 누를 수 있는거 제한
    let jobAuth = [0,0,0,0];

    //관리자 계정 
    if(useUserStore().$state.userInfo?.job == 10210){
      to.matched.some(record => jobAuth = record.meta.jobAuth)
      console.log('It is Administer Account');
      next();
      return;
    }

    //의사계정 
    if(useUserStore().$state.userInfo?.job == 10310){
      to.matched.some(record => jobAuth = record.meta.jobAuth)
      if(jobAuth[0]) next();
      else {
        alert('Not allowed for doctor')
        next('/dashboard');
      }
    }

    //간호사계정 
    else if(useUserStore().$state.userInfo?.job == 10410){
      to.matched.some(record => jobAuth = record.meta.jobAuth)
      if(jobAuth[1]) next();
      else {
        alert('Not allowed for nurse')
        next('/dashboard');
      }
    }

    //물리치료사 계정 
    else if(useUserStore().$state.userInfo?.job == 10510){
      to.matched.some(record => jobAuth = record.meta.jobAuth)
      if(jobAuth[2]) next();
      else {
        alert('Not allowed for therapist')
        next('/dashboard');
      }
      
    }

    //방사선사 계정 
    else if(useUserStore().$state.userInfo?.job == 10610){
      to.matched.some(record => jobAuth = record.meta.jobAuth)
      if(jobAuth[3]) next();
      else {
        alert('Not allowed for radiographer')
        next('/dashboard');
      }
      
    }
    else next();
  }
});

export default router
