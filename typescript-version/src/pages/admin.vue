<template>
  <div class="auth-wrapper d-flex">
    <VRow>
      <VCol
        cols="12"
        md="4"
      >
        <VCard class="auth-card">
          <form
            class="user_form"
            @submit.prevent="handleSubmit"
          >
            <h2>새 사용자 생성</h2>

            <div>
              <VTextField
                type="text"
                label="userName"
                v-model="user.name"
              />
            </div>
            <div>
              <VTextField
                type="email"
                label="userEmail"
                v-model="user.email"
              />
            </div>
            <div>
              <VTextField
                type="password"
                label="userPassword"
                v-model="user.password"
              />
            </div>
            <div>
              <VTextField
                type="text"
                label="userJob"
                v-model="user.job"
              />
            </div>
            <div>
              <VBtn>생성</VBtn>
            </div>
          </form>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        md="8"
      >
        <!-- USER LIST  -->
        <VCard class="user_list scroll-container">
          <VCardItem class="justify-center">
            <VCardTitle class="font-weight-semibold text-2xl text-uppercase"> USER LIST </VCardTitle>
          </VCardItem>

          <VDivider />

          <VCardText>
            <table class="list_table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Pw</th>
                  <th>Job</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in userInfo1"
                  :key="item.id"
                >
                  <td>{{ item.name }}</td>
                  <td>{{ item.email }}</td>
                  <td>{{ item.password }}</td>
                  <td>{{ item.job }}</td>
                  <td>
                    <VRow class="mb-4">
                      <!-- 삭제 버튼 -->
                      <VBtn
                        class="delete"
                        @click="deleteUser(item)"
                        >삭제</VBtn
                      >
                    </VRow>
                  </td>
                </tr>
              </tbody>
            </table>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script lang="ts" setup>
import userInfo from '@/exampleJson/userInfo.json'
import { reactive, ref } from 'vue'
let userInfo1 = userInfo
interface User {
  id: string
  name: string
  email: string
  password: string
  job: string
}

// reactive를 사용하여 사용자의 데이터를 반응형 객체로 만듭니다.
const user = reactive<User>({
  id: '',
  name: '',
  email: '',
  password: '',
  job: '',
})

const userList = ref([])

// onMounted(async () => {
//   try {
//     const token = sessionStorage.getItem('token')
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }

//     const response = await axios.get('http://yunsseong.uk:8000/api/user-list', config)
//     userList.value = response.data
//   } catch (error) {
//     console.error('Error fetching user list:', error.message)
//   }
// })

// 폼 제출 이벤트를 처리하는 함수입니다.
const handleSubmit = (): void => {
  // 사용자 생성 로직 작성
  // 백엔드로 user 객체를 보내는 API 호출 등을 구현할 수 있습니다.

  console.log(user) // 실제 개발에서는 제거
  addUser(user)
  // 폼 제출 후 입력 필드 초기화
  user.id = ''
  user.name = ''
  user.email = ''
  user.password = ''
  user.job = ''
}
const addUser = item => {
  userInfo1.push(item)
}
const editUser = item => {
  let index = userInfo1.findIndex(user => user.id === item.id)
  if (index !== -1) {
    userInfo1[index] = item
  }
}
const deleteUser = item => {
  userInfo1 = userInfo1.filter(user => user.id !== item.id)
}
</script>

<style scoped>
/* 스타일 정보는 이전 HTML 예제와 유사하므로 생략했습니다. */

.auth-card {
  align-content: center;
  block-size: 77.77vh;
}

.auth-card div {
  margin-block-start: 20px;
}

.user_list {
  block-size: 77.77vh;
}

.user_form {
  padding: 25px;
}

.list_table div {
  margin-block-start: 20px;
  text-align: end;
}

input {
  padding: 6px; /* 입력 텍스트와 테두리 간의 여백 */

  /* 테두리 스타일 및 색상 설정 */
  border: 2px solid grey; /* 예시: 파란색 테두리 */
  border-radius: 5px; /* 테두리 모서리의 둥근 정도 */
  padding-inline: 8px;
}

.list_table {
  border-collapse: separate; /* 셀 경계를 분리합니다. */
  border-spacing: 10px; /* 원하는 간격으로 설정합니다. */
  inline-size: 100%;
}

/* 예시 스타일 */
.list_table th,
.list_table td {
  padding: 10px; /* 셀 안의 내용과 경계 사이의 여백을 조절합니다. */
  text-align: center;
}

.edit,
.delete {
  margin: 3px;
}

.scroll-container {
  padding: 10px; /* 패딩 설정 */
  border: 1px solid #ccc; /* 경계선 스타일 */
  overflow-y: auto; /* 높이를 초과하면 y축 스크롤 바 표시 */
}
</style>
