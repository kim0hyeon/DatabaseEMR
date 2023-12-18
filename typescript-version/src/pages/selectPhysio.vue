<script lang="ts" setup>
import axios from 'axios'
import { Physio } from "@/pages/interfaces";
import { useStore } from 'vuex'

const token = sessionStorage.getItem('token')

const physioList = ref<Physio[]>([])
const selectedPhysio = ref([])

onMounted(async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/physio_type`, {
      headers: { Authorization: `Token ${token}` },
    })
    physioList.value = response.data
  } catch (error) {
    console.error(error)
  }
})

const store = useStore()

watch(selectedPhysio, async newVal => {
  console.log(newVal)
  await store.dispatch('updateSelectedPhysio', newVal)

  await nextTick()
})

const resetSelectedPhysio = () => {
  selectedPhysio.value = []
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
const searchResults = reactive<Physio[]>([])

const searchPhysio = (event: Event) => {
  searchTerm.value = (event.target as HTMLInputElement).value
  if (searchTerm.value) {
    searchResults.splice(
      0,
      searchResults.length,
      ...physioList.value.filter(physio => physio?.physio_name.includes(searchTerm.value)),
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
    style="max-width: 1000px"
  >
    <VCard style="max-width: 1000px">
      <VCardTitle>물리치료 목록</VCardTitle>

      <VDivider />

      <VRow class="ma-3">
        <VCol cols="12">
          <VTextField
            @input="searchPhysio"
            label="물리치료 검색"
            class="mb-3"
          />
          <v-data-table
            :headers="[
                { title: '선택', align: 'center', value: 'select' },
                { title: '이름', align: 'center', value: 'physio_name' },
                { title: '설명', align: 'center', value: 'physio_desciption' },
                { title: '종류', align: 'center', value: 'physio_kind' },
                { title: '수행', align: 'center', value: 'physio_value' },
                { title: '단위', align: 'center', value: 'physio_type' },
                { title: '비용', align: 'center', value: 'physio_cost' }
              ] as any"
            :items="searchTerm !== '' ? searchResults : physioList"
            :items-per-page="5"
          >
            <template v-slot:item.select="{ item }">
              <div style="display: flex; justify-content: center">
                <v-checkbox :value="item" v-model="selectedPhysio"></v-checkbox>
              </div>
            </template>
          </v-data-table>
        </VCol>
      </VRow>

      <VRow class="ma-1">
        <VCol>
          <VBtn @click="resetSelectedPhysio">초기화</VBtn>
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

<style lang="scss">
</style>
