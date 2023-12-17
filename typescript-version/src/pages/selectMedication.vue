<script lang="ts" setup>
import axios from 'axios'
import { useStore } from 'vuex'

interface Medication {
  medication_code: string
  medication_name: string
  medication_type: string
  medication_description: string
  administration_method: string
  medication_cost: number
}

const token = sessionStorage.getItem('token')

const medicationList = ref<Medication[]>([])
const selectedMedication = ref([])

onMounted(async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/medication`, {
      headers: { Authorization: `Token ${token}` },
    })
    medicationList.value = response.data
  } catch (error) {
    console.error(error)
  }
})

const store = useStore()

watch(selectedMedication, async newVal => {
  console.log(newVal)
  await store.dispatch('updateSelectedMedication', newVal)

  await nextTick()
})

const resetSelectedMedication = () => {
  selectedMedication.value = []
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
      <VCardTitle>검사 항목</VCardTitle>

      <VDivider />

      <VRow class="ma-3">
        <VCol cols="12">
          <VCheckbox
            v-for="(item, index) in medicationList"
            :key="index"
            :label="item.medication_name"
            :value="item"
            v-model="selectedMedication"
          ></VCheckbox>
        </VCol>
      </VRow>

      <VRow class="ma-1">
        <VCol>
          <VBtn @click="resetSelectedMedication">초기화</VBtn>
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
