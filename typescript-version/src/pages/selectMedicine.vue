<script lang="ts" setup>
import MedicineData from "@/exampleJson/medicine.json";
import {is} from "quasar";
import {useStore} from "vuex";

interface Medicine {
  id: string
  name: string
  cost: number
}

const medicineList = ref<Medicine[]>(MedicineData.medicine)
const selectedMedicine = ref([])

const store = useStore()

watch(selectedMedicine, async (newVal) => {
  console.log(newVal)
  await store.dispatch('updateSelectedMedicine', newVal)

  await nextTick()
})

const resetSelectedMedicine = () => {
  selectedMedicine.value = []
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
              v-for="(item, index) in medicineList"
              :key="index"
              :label="item.name"
              :value="item"
              v-model="selectedMedicine"></VCheckbox>
        </VCol>
      </VRow>

      <VRow class="ma-1">
        <VCol>
          <VBtn @click="resetSelectedMedicine">초기화</VBtn>
        </VCol>
        <VCol>
          <VBtn class="right-btn" @click="closeModal">확인</VBtn>
        </VCol>
      </VRow>
    </VCard>
  </VDialog>
</template>
