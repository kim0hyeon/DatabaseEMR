<script lang='ts'>
import ModalPhysicalInformation from '../statistics/ModalPhysicalInformation.vue'

export default {
  data() {
    return {
      openModal: false,
    }
  },
  methods: {
    clickAdd() {
      this.openModal = true
    },
    clickReset() {
      this.openModal = false
    },
  },
  components: {
    ModalPhysicalInformation,
  },
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
    <ModalPhysicalInformation />
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