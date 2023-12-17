<script lang="ts" setup>
import axios from 'axios'
import { Treatment } from "@/pages/interfaces";
import { useStore } from 'vuex'

const token = sessionStorage.getItem('token')

const treatmentList = ref<Treatment[]>([])
const selectedTreatment = ref([])

onMounted(async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/treatment`, {
      headers: { Authorization: `Token ${token}` },
    })
    treatmentList.value = response.data
  } catch (error) {
    console.error(error)
  }
})

const store = useStore()

watch(selectedTreatment, async newVal => {
  console.log(newVal)
  await store.dispatch('updateSelectedTreatment', newVal)

  await nextTick()
})

const resetSelectedTreatment = () => {
  selectedTreatment.value = []
}

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
  <VDialog
    v-model="isOpen"
    style="max-width: 600px"
  >
    <VCard style="max-width: 600px">
      <VCardTitle>치료 항목</VCardTitle>

      <VDivider />

      <VRow class="ma-3">
        <VCol cols="12">
          <VCheckbox
            v-for="(item, index) in treatmentList"
            :key="index"
            :label="item.treatment_name"
            :value="item"
            v-model="selectedTreatment"
          ></VCheckbox>
        </VCol>
      </VRow>

      <VRow class="ma-1">
        <VCol>
          <VBtn @click="resetSelectedTreatment">초기화</VBtn>
        </VCol>
        <VCol>
          <VBtn
            class="right-btn"
            @click="closeModal"
          >확인</VBtn>
        </VCol>
      </VRow>
    </VCard>
  </VDialog>
</template>
