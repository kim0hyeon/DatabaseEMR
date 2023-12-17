<script lang="ts" setup>
import { Disease } from "@/pages/interfaces";
import axios from 'axios'
import { useStore } from 'vuex'

const token = sessionStorage.getItem('token')

const diseaseList = ref<Disease[]>([])
const selectedDisease = ref([])

onMounted(async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/disease`, {
      headers: { Authorization: `Token ${token}` },
    })
    diseaseList.value = response.data
  } catch (error) {
    console.error(error)
  }
})

const store = useStore()

watch(selectedDisease, async newVal => {
  console.log(newVal)
  await store.dispatch('updateSelectedDisease', newVal)

  await nextTick()
})

const resetSelectedDisease = () => {
  selectedDisease.value = []
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
      <VCardTitle>질병 항목</VCardTitle>

      <VDivider />

      <VRow class="ma-3">
        <VCol cols="12">
          <VCheckbox
            v-for="(item, index) in diseaseList"
            :key="index"
            :label="item.disease_name"
            :value="item"
            v-model="selectedDisease"
          ></VCheckbox>
        </VCol>
      </VRow>

      <VRow class="ma-1">
        <VCol>
          <VBtn @click="resetSelectedDisease">초기화</VBtn>
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
