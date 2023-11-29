<script setup lang="ts">
import { useUserStore } from '@/store'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import userInfo from '../exampleJson/userInfo.json'
const loginStore = useUserStore();
const router = useRouter();
const form = ref({
  email: '',
  password: '',
  remember: false,
})

// http.get('/endpoint')
//   .then(response => {
//     // 데이터 사용
//   })
//   .catch(error => {
//     // 오류 처리
//     alert('에러발생') // 토큰 없으면 에러발생 아마 로그인창에서 에러발생 뜰거임 
//   });
  
import { reactive, toRefs } from 'vue'

// 로그인 폼을 위한 인터페이스 정의
interface LoginForm {
  email: string;
  password: string;
}

// API 응답 데이터의 인터페이스 정의
interface LoginResponse {
  token: string;
}

// 로그인 폼 데이터를 reactive 객체로 선언
const loginForm = reactive<LoginForm>({
  email: '',
  password: '',
});
interface UserInfo {
  id: number;
  name: string;
  email: string;
  password: string;
  token: string;
  job: Number;
}
const users = userInfo;
// 더미 사용자 데이터를 정의합니다.



// 실제 로그인 구현 
// const handleLogin = () => {
//   // 더미 데이터와 입력된 데이터가 일치하는지 확인합니다.
//   if (loginForm.email === DUMMY_USER.email && loginForm.password === DUMMY_USER.password) {
//     loginStore.getAccountInfo().then(()=>{
//         const loginResponse: LoginResponse = {
//         token: DUMMY_USER.token
//       };
//       // 예: 토큰을 상태 관리로 저장하거나, 로컬 스토리지에 저장할 수 있습니다.
//       // 상태 관리:
//       // import { reactive } from 'vue'; 
//       const token = reactive({ value: loginResponse.token });
//       // 로컬 스토리지:
//       sessionStorage.setItem('token', loginResponse.token);
//       alert('로그인 성공!');
//       router.push('/dashboard');
//     }).catch((error)=>{
//       // 로그인은 성공했지만 계정 정보 조회에 실패했을 경우의 처리 로직을 추가합니다.
//       console.error('계정 정보를 가져오는데 실패했습니다.', error);
//       // 필요한 경우 에러에 따른 추가적인 처리를 여기에 작성합니다.
//     });
//   }else{
//     alert('로그인 실패: 사용자 이름 또는 비밀번호가 올바르지 않습니다.');
//   }
// }

// 임시용 
const handleLogin = () => {
  //예시 사용자 데이터 
  const emailToCheck = loginForm.email.trim().toLowerCase();
  const passwordToCheck = loginForm.password.trim();
  const DUMMY_USER = users.find(user => 
  user.email.trim().toLowerCase() == emailToCheck && 
  user.password.trim() == passwordToCheck
  );
  // 더미 데이터와 입력된 데이터가 일치하는지 확인합니다.
  if (loginForm.email === DUMMY_USER?.email && loginForm.password === DUMMY_USER.password) {
      const loginResponse: LoginResponse = {
        token: DUMMY_USER.token
      };
      // 예: 토큰을 상태 관리로 저장하거나, 세션 스토리지에 저장할 수 있습니다.
      // 상태 관리:
      loginStore.loginSuccess(DUMMY_USER);
      const token = reactive({ value: loginResponse.token });
      // 세션 스토리지:
      sessionStorage.setItem('token', loginResponse.token);
      sessionStorage.setItem('userInfo', JSON.stringify(DUMMY_USER));
      alert(DUMMY_USER.name +'님 반갑습니다!');
      router.push('/dashboard');
    }
  else{
    alert('로그인 실패: 사용자 이름 또는 비밀번호가 올바르지 않습니다.');
  }
}

// 로그인 처리 함수
// const handleLogin = async () => {
//   try {
//     const response = await axios.post<LoginResponse>('/login', loginForm);
//     // 서버로부터 받은 토큰을 sessionStorage에 저장
//     sessionStorage.setItem('access_token', response.data.token);
//     loginStore.getAccountInfo();
//     // 로그인 후의 처리 (예: 라우터를 통한 페이지 이동)
//     router.push('/dashboard');
//     console.log('로그인 성공', response.data);
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       // Axios 에러를 처리
//       console.error('로그인 실패', error.response?.data);
//     } else {
//       // 기타 에러 처리
//       console.error('로그인 실패', error);
//     }
//   }
// };

// toRefs를 사용하여 반응형 객체의 각 property를 ref로 변환하여 템플릿에서 사용 가능하게 함
const { email, password } = toRefs(loginForm);

const vuetifyTheme = useTheme()
const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? authV1MaskLight
    : authV1MaskDark
})

const isPasswordVisible = ref(false)
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div v-html="logo" />
          </div>
        </template>

        <VCardTitle class="font-weight-semibold text-2xl text-uppercase">
          EMR SYSTEM
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 font-weight-semibold mb-1">
          Welcome to Our EMR! 👋🏻
        </h5>
        <p class="mb-0">
          Please sign-in to your account and start the adventure
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="() => {}">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="loginForm.email" 
                label="Email"
                type="email"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="loginForm.password"
                label="Password"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <VCheckbox
                  v-model="form.remember"
                  label="Remember me"
                />

                <a
                  class="ms-2 mb-1"
                  href="javascript:void(0)"
                >
                  Forgot Password?
                </a>
              </div>

              <!-- login button -->
              <VBtn
                block
                type="submit"
                @click="handleLogin"
              >
                Login
              </VBtn>
            </VCol>

            <!-- create account -->
            <VCol
              cols="12"
              class="text-center text-base"
            >
              <span>New on our platform?</span>
              <RouterLink
                class="text-primary ms-2"
                to="/register"
              >
                Create an account
              </RouterLink>
            </VCol>

            <VCol
              cols="12"
              class="d-flex align-center"
            >
              <VDivider />
              <span class="mx-4">or</span>
              <VDivider />
            </VCol>

            <!-- auth providers -->
            <VCol
              cols="12"
              class="text-center"
            >
              <AuthProvider />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VImg
      class="auth-footer-start-tree d-none d-md-block"
      :src="authV1Tree"
      :width="250"
    />

    <VImg
      :src="authV1Tree2"
      class="auth-footer-end-tree d-none d-md-block"
      :width="350"
    />

    <!-- bg img -->
    <VImg
      class="auth-footer-mask d-none d-md-block"
      :src="authThemeMask"
    />
  </div>
</template>

<style lang="scss">
@use "@core/scss/pages/page-auth.scss";
</style>
