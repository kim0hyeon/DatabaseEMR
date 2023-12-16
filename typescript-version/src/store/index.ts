
import { defineStore } from 'pinia';
import userInfo from '../exampleJson/userInfo.json';
import {createStore} from "vuex";
//환자아이디 
export const IdStore = defineStore('id', {
  state: () => ({
    id: ""
  }),
  actions: {
    setID(id: string){
      this.id = id
      this.name = name
    }
  },
  getters: {
    getID(state){
      return this.id
    },
    getName(state){
      return this.name
    }
  }
})

// 사용자 타입 예시 (백엔드에 따라 수정해야 함)
export interface UserInfo {
  id: number;
  name: string;
  email: string;
  password: string;
  token: string;
  job: Number;
}
const user = userInfo;

export const mediStore = defineStore('mediInfo', {
  state: () => ({
    id: ""
  }),
  actions: {
    setID(id: string){
      this.id= id
    }
  },
});

export const useUserStore = defineStore('userInfo', {
  state: () => ({
    userInfo: null, // 여기에 사용자 정보 저장됌 
    isLogin: false
  }),
  actions: {
    loginSuccess(payload) {
      this.isLogin = true
      this.userInfo = payload
    },
    logout() {
      this.isLogin = false
      this.userInfo = null
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('userInfo');
    },
    // 실제 필용한 getAccountInfo()
    // getAccountInfo() {
    //   return new Promise((resolve, reject) => {
    //     const token = sessionStorage.getItem('token');
    //     // axios를 사용하여 서버에서 계정 정보를 가져옵니다.
    //     axios.get('/userinfo', {
    //       headers: {
    //         'X-AUTH-TOKEN': token
    //       }
    //     })
    //     .then(response => {
    //       this.loginSuccess(response.data.data);
    //       resolve(response); // 성공 시 resolve를 호출합니다.
    //     })
    //     .catch(error => {
    //       console.error(error);
    //       reject(error); // 에러 발생 시 reject를 호출합니다.
    //     });
    //   });
    // }

    // 임시로 필요한 함수 
    getAccountInfo() {
      if(sessionStorage.getItem('token')){
        const token = sessionStorage.getItem('token')
        console.log('Check Token ');
        const storedUserInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        this.loginSuccess(storedUserInfo);
      }else{
        console.log('Token Out');
      }
    }
  }
})

export default createStore({
  state: {
    selectedInspection: [],
    selectedMedicine: []
  },
  mutations: {
    setSelectedInspection(state, inspections) {
      state.selectedInspection = inspections
    },
    setSelectedMedicine(state, medicine) {
      state.selectedMedicine = medicine
    },
    RESET_SELECTED_INSPECTION: state => {
      state.selectedInspection = []
    },
    RESET_SELECTED_MEDICINE: state => {
      state.selectedMedicine = []
    }
  },
  actions: {
    updateSelectedInspection({ commit }, inspections) {
      commit('setSelectedInspection', inspections)
    },
    updateSelectedMedicine({ commit }, medicine) {
      commit('setSelectedMedicine', medicine)
    },
    resetSelectedInspections: ({ commit }) => {
      commit('RESET_SELECTED_INSPECTION')
    },
    resetSelectedMedicine: ({ commit }) => {
      commit('RESET_SELECTED_MEDICINE')
    }
  },
  getters: {
    selectedInspection: state => state.selectedInspection,
    selectedMedicine: state => state.selectedMedicine
  }
})
