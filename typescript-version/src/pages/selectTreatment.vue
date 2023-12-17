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

// 검사 검색 로직
const searchTerm: Ref<string> = ref('')
const searchResults = reactive<Treatment[]>([])

const searchTreatment = (event: Event) => {
  searchTerm.value = (event.target as HTMLInputElement).value
  if (searchTerm.value) {
    searchResults.splice(
        0,
        searchResults.length,
        ...treatmentList.value.filter(treatment => treatment?.treatment_name.includes(searchTerm.value)),
    )
    console.log('after:', searchResults)
  } else {
    searchResults.splice(0, searchResults.length)
  }
}
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
          <VTextField
              @input="searchTreatment"
              label="치료 검색"
          />
          <v-data-table
              :headers="[
                { title: '선택', align: 'center', value: 'select' },
                { title: '치료 종류', align: 'center', value: 'treatment_name' },
                { title: '치료 비용', align: 'center', value: 'treatment_cost' },
              ] as any"
              :items="searchTerm !== '' ? searchResults : treatmentList"
              :items-per-page="5"
          >
            <template v-slot:item.select="{ item }">
              <div style="display: flex; justify-content: center">
                <v-checkbox :value="item" v-model="selectedTreatment"></v-checkbox>
              </div>
            </template>
          </v-data-table>
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
