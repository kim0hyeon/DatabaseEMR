<script setup lang="ts">
import PhysiotherapyModal from '@/views/pages/therapy/PhysiotherapyModal.vue'
import RehabilitationModal from '@/views/pages/therapy/RehabilitationModal.vue'
// Components 일단 환자 정보를 불러와야 하기 때문에 사용함
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()

const activeTab = ref(route.params.tab)

const tabs = [
  { title: '물리치료', icon: 'mdi-camera', tab: 'Physiotherapy' },
  { title: '재활치료', icon: 'mdi-water', tab: 'rehabilitation' },
]

// 사용자 타입
interface Patient {
  patient_id: string
  patient_name: string
  patient_gender: string
  patient_birth: string
  patient_residence_number: string
  patient_phone_number: string
  patient_emergency_phone_number: string
  patient_address: string
  patient_agree_essential_term: boolean
  patient_agree_optional_term: boolean
}

// 백엔드에서 환자 정보 받아오기
let patientInformation = ref<Patient[]>([])

onMounted(async () => {
  try {
    const response = await axios.get('http://yunsseong.uk:8000/api/patients/')
    patientInformation.value = response.data
    console.log('patient data loding success')
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <div>
    <VTabs
      v-model="activeTab"
      show-arrows
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow
      v-model="activeTab"
      class="mt-5 disable-tab-transition"
    >
      <!-- 물리치료 -->
      <VWindowItem value="Physiotherapy">
        <PhysiotherapyModal />
      </VWindowItem>

      <!-- 재활치료 -->
      <VWindowItem value="rehabilitation">
        <RehabilitationModal />
      </VWindowItem>
    </VWindow>
  </div>
</template>

<style lang="scss">
@use '@core/scss/pages/page-auth.scss';
</style>
