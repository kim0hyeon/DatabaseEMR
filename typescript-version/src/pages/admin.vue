<template>
  <div class="auth-wrapper d-flex">
    <VCard
        class="auth-card pa-4 pt-7"
      >

    <form class="user_form" @submit.prevent="handleSubmit">
      <h2>새 사용자 생성</h2>
      <div>
        <VTextField type="text" label="userlabel" v-model="user.id" />
      </div>
      <div>
        <VTextField type="text" label="userName" v-model="user.name" />
      </div> 
      <div>
        <VTextField type="email" label="userEmail" v-model="user.email" />
      </div>
      <div>
        <VTextField type="password" label="userPassword" v-model="user.password" />
      </div>
      <div>
        <VTextField type="text" label="userToken" v-model="user.token" />
      </div>
      <div>
        <VTextField type="text" label="userJob" v-model="user.job" />
      </div>
      <div>
        <input type="submit" value="생성" />
      </div>
    </form>
    </VCard>
    <!-- USER LIST  -->
    <VCard
    class="user_list"
    >
      <VCardItem class="justify-center">

        <VCardTitle class="font-weight-semibold text-2xl text-uppercase">
          USER LIST
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Pw</th>
              <th>Job</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in userInfo1" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.password }}</td>
              <td>{{ item.job }}</td>
              <td>
                <button @click="editUser(item)">Edit</button> <!-- 수정 버튼 -->
                <button @click="deleteUser(item)">Delete</button> <!-- 삭제 버튼 -->
              </td>
            </tr>
          </tbody>
        </table>
      </VCardText>
    </VCard>
  </div>
</template>

<script lang="ts" setup>
import userInfo from '@/exampleJson/userInfo.json';
import { reactive } from 'vue';
let userInfo1 = userInfo;
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  token: string;
  job: string;
}

// reactive를 사용하여 사용자의 데이터를 반응형 객체로 만듭니다.
const user = reactive<User>({
  id: '',
  name: '',
  email: '',
  password: '',
  token: '',
  job: '',
});

// 폼 제출 이벤트를 처리하는 함수입니다.
const handleSubmit = (): void => {
  // 사용자 생성 로직 작성
  // 백엔드로 user 객체를 보내는 API 호출 등을 구현할 수 있습니다.

  console.log(user); // 실제 개발에서는 제거
  addUser(user);
  // 폼 제출 후 입력 필드 초기화
  user.id = '';
  user.name = '';
  user.email = '';
  user.password = '';
  user.token = '';
  user.job = '';
};
const addUser = (item) => {
  userInfo1.push(item);
}
const editUser = (item) => {
  let index = userInfo1.findIndex(user => user.id === item.id);
      if (index !== -1) {
        userInfo1[index] = item;
      }
}
const deleteUser = (item) => {
  userInfo1 = userInfo1.filter(user => user.id !== item.id);
}
</script>

<style scoped>
/* 스타일 정보는 이전 HTML 예제와 유사하므로 생략했습니다. */

.auth-card {
  margin: 20px;
  block-size: 66.66vh;
  inline-size: 30%;
}

.user_list {
  margin: 20px;
  block-size: 66.66vh;
  inline-size: 60%;
}

.user_form {
  padding: 25px;
}

div {
  margin-block-start: 20px;
}
</style>
