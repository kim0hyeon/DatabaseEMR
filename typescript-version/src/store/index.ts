
import { defineStore } from 'pinia';
import { createStore } from "vuex";
import userInfo from '../exampleJson/userInfo.json';
import {di} from "@fullcalendar/core/internal-common";
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
    selectedDisease: [],
    selectedTreatment: [],
    selectedMedication: []
  },
  mutations: {
    setSelectedInspection(state, inspections) {
      state.selectedInspection = inspections
    },
    setSelectedDisease(state, diseases) {
      state.selectedDisease = diseases
    },
    setSelectedTreatment(state, treatments) {
      state.selectedTreatment = treatments
    },
    setSelectedMedication(state, Medication) {
      state.selectedMedication = Medication
    },
    RESET_SELECTED_INSPECTION: state => {
      state.selectedInspection = []
    },
    RESET_SELECTED_DISEASE: state => {
      state.selectedDisease = []
    },
    RESET_SELECTED_TREATMENT: state => {
      state.selectedTreatment = []
    },
    RESET_SELECTED_MEDICATION: state => {
      state.selectedMedication = []
    }
  },
  actions: {
    updateSelectedInspection({ commit }, inspections) {
      commit('setSelectedInspection', inspections)
    },
    updateSelectedDisease({ commit }, diseases) {
      commit('setSelectedDisease', diseases)
    },
    updateSelectedTreatment({ commit }, treatments) {
      commit('setSelectedTreatment', treatments)
    },
    updateSelectedMedication({ commit }, medications) {
      commit('setSelectedMedication', medications)
    },
    resetSelectedInspections: ({ commit }) => {
      commit('RESET_SELECTED_INSPECTION')
    },
    resetSelectedDisease: ({ commit }) => {
      commit('RESET_SELECTED_DISEASE')
    },
    resetSelectedTreatment: ({ commit }) => {
      commit('RESET_SELECTED_TREATMENT')
    },
    resetSelectedMedication: ({ commit }) => {
      commit('RESET_SELECTED_MEDICATION')
    }
  },
  getters: {
    selectedInspection: state => state.selectedInspection,
    selectedDisease: state => state.selectedDisease,
    selectedTreatment: state => state.selectedTreatment,
    selectedMedication: state => state.selectedMedication
  }
})
