<script lang='ts' setup>
import ModalBloodPressureTestVue from './ModalBloodPressureTest.vue'

const isModalOpen = ref(false)
const openModal = () => {
  isModalOpen.value = true
}
</script>

<template>
  <div v-if="openModal === false">
    <VBtn
      class="mt-3 offset-md-5"
      size="100"
      @click="clickAdd"
      >추가</VBtn
    >
  </div>
  <div v-else>
    <div v-if="openModal"></div>
    <VBtn
      class="mt-5 offset-md-11"
      @click="clickReset"
      >초기화</VBtn
    >
  </div>
</template>
<style lang='scss'>
@use '@core/scss/pages/page-auth.scss';
</style>