<script lang='ts' setup>
import axios from 'axios'
import { ref } from 'vue'

// 아이템 만들기
const selectedItem = ref<string | null>(null)

const items = [
  { label: '혈압', value: 'bloodpressure' },
  { label: '안압', value: 'eyepressure' },
  { label: '체온', value: 'temperature' },
]

// 모달창 구현
const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])

let isOpen = ref(props.modelValue)
const closeModal = () => {
  isOpen.value = false
}

watch(
  () => props.modelValue,
  newVal => {
    isOpen.value = newVal
  },
  { immediate: true },
)

watch(
  () => isOpen.value,
  newVal => {
    if (props.modelValue !== newVal) {
      emit('update:modelValue', newVal)
    }
  },
)
</script>
<template>
  <VCard title="혈압, 안압, 체온 중 하나를 골라주세요">
    <form @submit.prevent="handleSubmit">
      <v-radio-group v-model="selectedItem">
        <v-radio
          v-for="(item, index) in items"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></v-radio>
      </v-radio-group>
      <button type="submit">제출</button>
    </form>
    on total
  </VCard>
</template>
<style lang='scss'>
@use '@core/scss/pages/page-auth.scss';
</style>