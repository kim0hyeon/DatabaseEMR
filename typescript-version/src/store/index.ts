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
import { defineStore } from 'pinia'
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
