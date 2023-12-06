<script setup lang="ts">
<<<<<<< Updated upstream
import { useRoute } from 'vue-router'
import Physiotherapy from '@/views/pages/therapy/Physiotherapy.vue'
import Rehabilitation from '@/views/pages/therapy/Rehabilitation.vue'

// Components 일단 환자 정보를 불러와야 하기 때문에 사용함
import PatientData from '../exampleJson/patient.json'
import { defineComponent, ref, onMounted, reactive } from 'vue'
import { Store } from 'pinia'
import { IdStore } from '@/store/index'
import axios from 'axios'

// 사용자 타입 예시 (백엔드에 따라 수정해야 함)
interface Patient {
  id: number
  name: string
  age: number
  gender: string
  diagnosis: string
}

const patients = reactive<Patient[]>(PatientData.patients)
console.log(patients)
console.log(IdStore().id)
console.log(patients[IdStore().id])

let patientId: { id: number; name: string; age: number; gender: string; diagnosis: string } | undefined
patientId = patients[0] // 변수 선언

function clickPatient(event: MouseEvent) {
  patientId = patients.find(patient => patient.id === IdStore().id)

  if (patientId == null) {
    patientId = patients.find(patient => patient.id === 1)
  } else {
    console.log(patientId)
  }
}

document.documentElement.addEventListener('click', clickPatient)
=======
import Physiotherapy from '@/views/pages/therapy/Physiotherapy.vue'
import Rehabilitation from '@/views/pages/therapy/Rehabilitation.vue'
import { useRoute } from 'vue-router'

// Components 일단 환자 정보를 불러와야 하기 때문에 사용함
import { ref } from 'vue'
>>>>>>> Stashed changes

const route = useRoute()

const activeTab = ref(route.params.tab)

const tabs = [
  { title: '물리치료', icon: 'mdi-camera', tab: 'image' },
  { title: '재활치료', icon: 'mdi-water', tab: 'blood' },
]
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
<<<<<<< Updated upstream
=======
        style="margin-right: 300px"
>>>>>>> Stashed changes
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>
    <VDivider />
    <VWindow
      v-model="activeTab"
      class="mt-5 disable-tab-transition"
    >
      <!-- 물리치료 -->
      <VWindowItem value="image">
        <Physiotherapy />
      </VWindowItem>

      <!-- 재활치료 -->
      <VWindowItem value="blood">
        <Rehabilitation />
      </VWindowItem>
    </VWindow>
  </div>
</template>

<style lang="scss">
@use '@core/scss/pages/page-auth.scss';
</style>
