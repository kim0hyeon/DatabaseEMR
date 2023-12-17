<script setup lang="ts">
import { IdStore } from '@/store';
import { useRoute } from 'vue-router';
import patientData from '../exampleJson/patient.json';
import Inspection from '@/exampleJson/inspection.json'
import costData from '@/exampleJson/Cost.json'
import axios from "axios";
const store = IdStore();

interface Chart {
  chart_id: string
  inspect: []
  disease: []
  treatment: []
  medication: []
}

interface Inspection {
  inspect_type_id: string
  inspect_type: string
  inspect_cost: number
}

let patient_id = ref('')

const route = useRoute();

watchEffect(async () => {
  console.log(`ID changed to ${store.id}`);
  patient_id.value = store.id
  await loadPatientChart()
});

// 환자 차트 불러오기
let chartData = ref<Chart>()

const loadPatientChart = async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/chart?patient=${ patient_id.value }`)
    chartData.value = response.data
    console.log('load', chartData.value)
  } catch (error) {
    console.error(error)
  }
}

// 검사 데이터 불러오기
let inspection = ref<Inspection>()

onMounted(async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/inspect_type/`)
    inspection.value = response.data
    console.log('load', inspection.value)
  } catch (error) {
    console.error(error)
  }
})

// Cost.json에서 환자의 검사 및 약제 비용 찾기
const findInspectionCost = (name: string) => {
  const item = costs.inspectionCost.find(cost => cost.name === name)
  return item ? item.cost : 0
}

const findMedicineCost = (name: string) => {
  const item = costs.medicineCost.find(cost => cost.name === name)
  return item ? item.cost : 0
}

// 최종 금액 계산
const inspectionTotalCost = ref(0)
const medicineTotalCost = ref(0)
const totalCost = ref(0)

watchEffect(() => {
  let diagnosisSum = 0
  let inspectionSum = 0
  let treatmentSum = 0
  let medicineSum = 0
  inspectionData.value?.forEach(item => {
    if (item.patientId === patientInfo.value?.id) {
      item.inspectionName.forEach(name => {
        inspectionSum += findInspectionCost(name)
      })
      item.medicineName.forEach(name => {
        medicineSum += findMedicineCost(name)
      })
    }
  })
  inspectionTotalCost.value = inspectionSum
  medicineTotalCost.value = medicineSum

  totalCost.value = inspectionTotalCost.value + medicineTotalCost.value
})


</script>
<template>
  <VRow>
    <VCol cols="12" md="6">
      <!-- 진료 비용 -->
      <VCard>
        <VCardTitle>진료 비용</VCardTitle>

        <VDivider/>

        <table class="list_table">
          <thead>
          <tr>
            <th>진료 항목</th>
            <th>비용</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="item in filteredInspectionData">
            <tr v-for="name in item.inspectionName">
              <td>{{ name }}</td>
              <td>{{ findInspectionCost(name) }}원</td>
            </tr>
          </template>
          </tbody>
        </table>

        <VDivider/>

        <VRow class="text-center">
          <VCol>
            <VCardTitle class="font-weight-semibold text-2xl text-uppercase">총합</VCardTitle>
          </VCol>

          <VCol>
            <VCardTitle class="font-weight-semibold text-2xl text-uppercase">
              {{ inspectionTotalCost }}원
            </VCardTitle>
          </VCol>
        </VRow>
      </VCard>
    </VCol>
    <VCol cols="12" md="6">
      <!-- 검사 비용 -->
      <VCard>
        <VCardTitle>검사 비용</VCardTitle>

        <VDivider/>

        <table class="list_table">
          <thead>
          <tr>
            <th>검사 항목</th>
            <th>비용</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="item in filteredInspectionData">
            <tr v-for="name in item.inspectionName">
              <td>{{ name }}</td>
              <td>{{ findInspectionCost(name) }}원</td>
            </tr>
          </template>
          </tbody>
        </table>

        <VDivider/>

        <VRow class="text-center">
          <VCol>
            <VCardTitle class="font-weight-semibold text-2xl text-uppercase">총합</VCardTitle>
          </VCol>

          <VCol>
            <VCardTitle class="font-weight-semibold text-2xl text-uppercase">
              {{ inspectionTotalCost }}원
            </VCardTitle>
          </VCol>
        </VRow>
      </VCard>
    </VCol>
    <VCol cols="12" md="6">
      <!-- 검사 비용 -->
      <VCard>
        <VCardTitle>물리 및 재활치료 비용</VCardTitle>

        <VDivider/>

        <table class="list_table">
          <thead>
          <tr>
            <th>치료 항목</th>
            <th>비용</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="item in filteredInspectionData">
            <tr v-for="name in item.inspectionName">
              <td>{{ name }}</td>
              <td>{{ findInspectionCost(name) }}원</td>
            </tr>
          </template>
          </tbody>
        </table>

        <VDivider/>

        <VRow class="text-center">
          <VCol>
            <VCardTitle class="font-weight-semibold text-2xl text-uppercase">총합</VCardTitle>
          </VCol>

          <VCol>
            <VCardTitle class="font-weight-semibold text-2xl text-uppercase">
              {{ inspectionTotalCost }}원
            </VCardTitle>
          </VCol>
        </VRow>
      </VCard>
    </VCol>

    <!-- 처방 비용 -->
    <VCol cols="12" md="6">
      <VCard>
        <VRow>
          <VCol cols="12">
            <VCardTitle>약제 비용</VCardTitle>
          </VCol>
        </VRow>

        <VDivider/>

        <table class="list_table">
          <thead>
          <tr>
            <th>처방 목록</th>
            <th>비용</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="item in filteredInspectionData">
            <tr v-for="name in item.medicineName">
              <td>{{ name }}</td>
              <td>{{ findMedicineCost(name) }}원</td>
            </tr>
          </template>
          </tbody>
        </table>

        <VDivider/>

        <VRow class="text-center">
          <VCol>
            <VCardTitle class="font-weight-semibold text-2xl text-uppercase">총합</VCardTitle>
          </VCol>

          <VCol>
            <VCardTitle class="font-weight-semibold text-2xl text-uppercase">
              {{ medicineTotalCost }}원
            </VCardTitle>
          </VCol>
        </VRow>
      </VCard>
    </VCol>

    <!-- 최종 금액 -->
    <VCol cols="12">
      <VCard title="최종금액">
        <VDivider/>
        <table class="list_table">
          <thead>
          <tr>
            <th>이름</th>
            <th>진료비용</th>
            <th>검사비용</th>
            <th>물리 및 재활치료 비용</th>
            <th>약제비용</th>
            <th>최종금액</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="item in filteredInspectionData">
            <tr>
              <td>{{ item.patientName }}</td>
              <td>{{ inspectionTotalCost }}원</td>
              <td>{{ medicineTotalCost }}원</td>
              <td>{{ totalCost }}원</td>
            </tr>
          </template>
          </tbody>
        </table>
      </VCard>
      <VBtn class="mt-5 offset-md-11"> 출력 </VBtn>
    </VCol>
  </VRow>
</template>

<style scoped>

/* table style */
.list_table {
  border-collapse: separate; /* 셀 경계 분리 */
  border-spacing: 10px; /* 간격 설정 */
  inline-size: 100%;
  color: black;
}

.list_table th,
.list_table td {
  padding: 10px;
  text-align: center;
}

.list_table th {
  font-size: 15px;
}
</style>
