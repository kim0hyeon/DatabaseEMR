<script lang="ts" setup>
import axios from 'axios'
import { Medication } from "@/pages/interfaces";
import { useStore } from 'vuex'

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
    style="max-width: 800px"
  >
    <VCard style="max-width: 800px">
      <VCardTitle>검사 항목</VCardTitle>

      <VDivider />

      <VRow class="ma-3">
        <VCol cols="12">
          <v-data-table
              :headers="[
                { title: '선택', align: 'center', value: 'select' },
                { title: '약품 이름', align: 'center', value: 'medication_name' },
                { title: '약품 유형', align: 'center', value: 'medication_type' },
                { title: '약품 설명', align: 'center', value: 'medication_description' },
                { title: '복용 방법', align: 'center', value: 'administration_method' },
                { title: '약품 비용', align: 'center', value: 'medication_cost' },
              ] as any"
              :items="medicationList"
              :items-per-page="5"
          >
            <template v-slot:item.select="{ item }">
              <div style="display: flex; justify-content: center">
                <v-checkbox :value="item" v-model="selectedMedication"></v-checkbox>
              </div>
            </template>
          </v-data-table>
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
