<script setup lang="ts">
import { useUserStore } from '@/store'
import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import userInfo from '../exampleJson/userInfo.json'
const loginStore = useUserStore()
const router = useRouter()
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
  email: string
  password: string
}

// API 응답 데이터의 인터페이스 정의
interface LoginResponse {
  token: string
}

// 로그인 폼 데이터를 reactive 객체로 선언
const loginForm = reactive<LoginForm>({
  email: '',
  password: '',
})
interface UserInfo {
  id: number
  name: string
  email: string
  password: string
  token: string
  job: Number
}
const users = userInfo
// 더미 사용자 데이터를 정의합니다.
const handleLogin = async () => {
  try {
    const response = await axios.post('http://yunsseong.uk:8000/api/token/', {
      username: loginForm.email,
      password: loginForm.password,
    })

    // 서버로부터 받은 토큰을 활용하여 로그인 성공 후의 처리
    const token = response.data.token
    console.log(token)
    sessionStorage.setItem('token', token)
    const userInfo = await axios.get('http://yunsseong.uk:8000/api/medical/', {
      headers: { Authorization: `Token ${token}` },
    })
    console.log(userInfo.data[0].medical_person_birthday)
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
    console.log('로그인 성공! 토큰:', token)
    router.push('home')
    // 로그인 성공 후의 추가 로직을 수행하면 됩니다.
  } catch (error) {
    // 로그인 실패 시의 처리
    console.error('로그인 실패:', error.message)

    // 로그인 실패 시의 추가 로직을 수행하면 됩니다.
  }
}
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
// const handleLogin = () => {
//   //예시 사용자 데이터
//   const emailToCheck = loginForm.email.trim().toLowerCase()
//   const passwordToCheck = loginForm.password.trim()
//   const DUMMY_USER = users.find(
//     user => user.email.trim().toLowerCase() == emailToCheck && user.password.trim() == passwordToCheck,
//   )
//   // 더미 데이터와 입력된 데이터가 일치하는지 확인합니다.
//   if (loginForm.email === DUMMY_USER?.email && loginForm.password === DUMMY_USER.password) {
//     const loginResponse: LoginResponse = {
//       token: DUMMY_USER.token,
//     }
//     // 예: 토큰을 상태 관리로 저장하거나, 세션 스토리지에 저장할 수 있습니다.
//     // 상태 관리:
//     loginStore.loginSuccess(DUMMY_USER)
//     const token = reactive({ value: loginResponse.token })
//     // 세션 스토리지:
//     sessionStorage.setItem('token', loginResponse.token)
//     sessionStorage.setItem('userInfo', JSON.stringify(DUMMY_USER))
//     alert(DUMMY_USER.name + '님 반갑습니다!')
//     router.push('/home')
//   }
// 예: 토큰을 상태 관리로 저장하거나, 세션 스토리지에 저장할 수 있습니다.
// 상태 관리:
// }

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
const { email, password } = toRefs(loginForm)

const vuetifyTheme = useTheme()
const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? authV1MaskLight : authV1MaskDark
})

const isPasswordVisible = ref(false)
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard class="auth-card pa-4 pt-7">
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div v-html="logo" />
          </div>
        </template>

        <VCardTitle class="font-weight-semibold text-2xl text-uppercase"> EMR SYSTEM </VCardTitle>
      </VCardItem>

      <VCardText class="InputIDPW mt-6">
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

              <!-- login button -->
              <VBtn
                block
                class="mt-10"
                type="submit"
                @click="handleLogin"
              >
                Login
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
@use '@core/scss/pages/page-auth.scss';

.InputIDPW {
  inline-size: 400px;
}
</style>
