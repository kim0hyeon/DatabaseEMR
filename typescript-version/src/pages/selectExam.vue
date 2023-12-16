<script lang="ts" setup>
import ExaminationData from "@/exampleJson/examination.json";
import {is} from "quasar";
import {useStore} from "vuex";

interface Examination {
  id: string
  name: string
  cost: number
}

const examList = ref<Examination[]>(ExaminationData.examination)
const selectedExam = ref([])

const store = useStore()

watch(selectedExam, async (newVal) => {
  console.log(newVal)
  await store.dispatch('updateSelectedExam', newVal)

  await nextTick()
})

const resetSelectedExam = () => {
  selectedExam.value = []
}

// 모달창 구현
const props = defineProps({
  modelValue: Boolean
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
</script>

<template>
  <VDialog v-model="isOpen" style="max-width: 600px;">
    <VCard style="max-width: 600px;">
      <VCardTitle>검사 항목</VCardTitle>

      <VDivider/>

      <VRow class="ma-3">
        <VCol cols="12">
          <VCheckbox
            v-for="(item, index) in examList"
            :key="index"
            :label="item.name"
            :value="item"
            v-model="selectedExam"></VCheckbox>
        </VCol>
      </VRow>

      <VRow class="ma-1">
        <VCol>
          <VBtn @click="resetSelectedExam">초기화</VBtn>
        </VCol>
        <VCol>
          <VBtn class="right-btn" @click="closeModal">확인</VBtn>
        </VCol>
      </VRow>
    </VCard>
  </VDialog>
</template>
