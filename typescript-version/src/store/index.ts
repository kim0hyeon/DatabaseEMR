// // store/index.js
// import { createStore } from 'vuex';

// export default createStore({
//   state: {
//     data: null,
//   },
//   mutations: {
//     setData(state, payload) {
//       state.data = payload;
//     },
//   },
//   actions: {
//     updateData({ commit }, payload) {
//       commit('setData', payload);
//     },
//   },
// });

// store/index.js
// import { api } from "api"; // api 모듈 임포트
import { defineStore } from 'pinia';
export const IdStore = defineStore('id', {
  state: () => ({
    id: 0
  }),
  actions: {
    setID(id){
      this.id = id
    }
  },
  getters: {
    getID(state){
      return this.id
    }
  }
})

// 사용자 타입 예시 (백엔드에 따라 수정해야 함)
export interface UserInfo {
  id: Number;
  email: string;
  name: string;
  // 추가적으로 필요한 필드가 있다면 여기에 정의합니다.
}
const user: UserInfo = {
  id: 1,
  email: 'gildong@naver.com',
  name:'홍길동'
}

export const useUserStore = defineStore('userInfo', {
  state: () => ({
    userInfo: null, // 여기에 사용자 정보 저장됌 
    isLogin: false
  }),
  actions: {
    loginSuccess(payload) {
      this.isLogin = true
      this.userInfo = payload
      // console.log(this.userInfo.name);
    },
    logout() {
      this.isLogin = false
      this.userInfo = null
      sessionStorage.removeItem('token')
    },
    getAccountInfo() {
      const token = sessionStorage.getItem('token')
      // axios
      //   .get('/userinfo', {
      //     headers: {
      //       'X-AUTH-TOKEN': token
      //     }
      //   })
      //   .then(response => {
      //     this.loginSuccess(response.data.data)
      //   })
      //   .catch(error => {
      //     console.error(error)
      //   })
      this.loginSuccess(user);
    }
  }
})
