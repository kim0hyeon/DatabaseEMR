<script setup lang="ts">
import QRCode from "qrcode";
// 모달창 구현
const props = defineProps({
  modelValue: Boolean,
  patient_id: String,
  url: String
})

const emit = defineEmits(['update:modelValue'])

let isOpen = ref(props.modelValue)
const closeModal = () => {
  isOpen.value = false
}

watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal
}, { immediate: true })

watch(() => isOpen.value, (newVal) => {
  if (props.modelValue !== newVal) {
    emit('update:modelValue', newVal)
  }
})

const printQR = () => {
  window.print()
}
</script>

<template>
  <VDialog v-model="isOpen" style="max-width: 400px; max-height: 500px;" class="modal">
    <VCard>
      <VRow>
        <VCol cols="12" class="text-center pb-0">
          <img v-if="props.url" :src="props.url" alt="QRCode" style="width: 300px; height: 300px;">
        </VCol>
      </VRow>
      <VRow>
        <VCol cols="12">
          <VCardText>ID: {{ props.patient_id??'Not Selected Patient' }}</VCardText>
        </VCol>
      </VRow>
      <VRow class="mt-0">
        <VCol>
          <VBtn @click="closeModal" class="right-btn">닫기</VBtn>
          <VBtn @click="printQR" class="right-btn">출력</VBtn>
        </VCol>
      </VRow>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.right-btn {
  float: inline-end;
  margin-inline-start: 10px;
}
</style>
