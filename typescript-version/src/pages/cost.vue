<script setup lang="ts">
import Inspection from '@/exampleJson/inspection.json'
import { IdStore } from '@/store'
import axios from 'axios'
import { useRoute } from 'vue-router'
const store = IdStore()
const token = sessionStorage.getItem('token')

interface Chart {
  chart_id: string
  patient: {
    patient_name: string
  }
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

// 환자 차트 불러오기
let chartData = ref<Chart>()

const loadPatientChart = async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/chart?patient=${patient_id.value}`, {
      headers: { Authorization: `Token ${token}` },
    })
    chartData.value = response.data[0]
  } catch (error) {
    console.error(error)
  }
}

// 검사 데이터 불러오기
let inspectionData = ref<Inspection[]>([])

onMounted(async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/inspect_type/`, {
      headers: { Authorization: `Token ${token}` },
    })
    inspectionData.value = response.data
  } catch (error) {
    console.error(error)
  }
})

const route = useRoute()

// 환자가 받은 검사 목록
let patientInspections = ref<Inspection[]>([])

watchEffect(async () => {
  console.log(`ID changed to ${store.id}`)
  patient_id.value = store.id
  await loadPatientChart()
})

watchEffect(() => {
  if (chartData.value && chartData.value.inspect && inspectionData.value.length > 0) {
    const inspections = chartData.value.inspect.map(inspect_id => {
      return inspectionData.value.find(inspection => inspection.inspect_type_id === inspect_id)
    })

    patientInspections.value = inspections.filter(Boolean) as Inspection[]
  }
})

// 최종 금액 계산
const diagnosisTotalCost = ref(0)
const inspectionTotalCost = ref(0)
const treatmentTotalCost = ref(0)
const medicineTotalCost = ref(0)
const totalCost = ref(0)


watchEffect(() => {
  let diagnosisSum = 0
  let inspectionSum = 0
  let treatmentSum = 0
  let medicineSum = 0

  patientInspections.value?.forEach(item => {
    inspectionSum += item.inspect_cost
  })

  inspectionTotalCost.value = inspectionSum
  medicineTotalCost.value = medicineSum

  totalCost.value =
    diagnosisTotalCost.value + inspectionTotalCost.value +
    treatmentTotalCost.value + medicineTotalCost.value
})

</script>
<template>
  <VRow>
    <VCol
      cols="12"
      md="6"
    >
      <!-- 진료 비용 -->
      <VCard>
        <VCardTitle>진료 비용</VCardTitle>

        <VDivider />

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

        <VDivider />

        <VRow class="text-center">
          <VCol>
            <VCardTitle class="font-weight-semibold text-2xl text-uppercase">총합</VCardTitle>
          </VCol>

          <VCol>
            <VCardTitle class="font-weight-semibold text-2xl text-uppercase"> {{ inspectionTotalCost }}원 </VCardTitle>
          </VCol>
        </VRow>
      </VCard>
    </VCol>
    <VCol
      cols="12"
      md="6"
    >
      <!-- 검사 비용 -->
      <VCard>
        <VCardTitle>검사 비용</VCardTitle>

        <VDivider />

        <table class="list_table">
          <thead>
            <tr>
              <th>검사 항목</th>
              <th>비용</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in patientInspections">
              <tr>
                <td>{{ item.inspect_type }}</td>
                <td>{{ item.inspect_cost }}원</td>
              </tr>
            </template>
          </tbody>
        </table>

        <VDivider />

        <VRow class="text-center">
          <VCol>
            <VCardTitle class="font-weight-semibold text-2xl text-uppercase">총합</VCardTitle>
          </VCol>

          <VCol>
            <VCardTitle class="font-weight-semibold text-2xl text-uppercase"> {{ inspectionTotalCost }}원 </VCardTitle>
          </VCol>
        </VRow>
      </VCard>
    </VCol>
    <VCol
      cols="12"
      md="6"
    >
      <!-- 검사 비용 -->
      <VCard>
        <VCardTitle>물리 및 재활치료 비용</VCardTitle>

        <VDivider />

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

        <VDivider />

        <VRow class="text-center">
          <VCol>
            <VCardTitle class="font-weight-semibold text-2xl text-uppercase">총합</VCardTitle>
          </VCol>

          <VCol>
            <VCardTitle class="font-weight-semibold text-2xl text-uppercase"> {{ inspectionTotalCost }}원 </VCardTitle>
          </VCol>
        </VRow>
      </VCard>
    </VCol>

    <!-- 처방 비용 -->
    <VCol
      cols="12"
      md="6"
    >
      <VCard>
        <VRow>
          <VCol cols="12">
            <VCardTitle>약제 비용</VCardTitle>
          </VCol>
        </VRow>

        <VDivider />

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

        <VDivider />

        <VRow class="text-center">
          <VCol>
            <VCardTitle class="font-weight-semibold text-2xl text-uppercase">총합</VCardTitle>
          </VCol>

          <VCol>
            <VCardTitle class="font-weight-semibold text-2xl text-uppercase"> {{ medicineTotalCost }}원 </VCardTitle>
          </VCol>
        </VRow>
      </VCard>
    </VCol>

    <!-- 최종 금액 -->
    <VCol cols="12">
      <VCard title="최종금액">
        <VDivider />
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
            <tr>
              <td>{{ chartData?.patient.patient_name }}</td>
              <td>{{ diagnosisTotalCost }}</td>
              <td>{{ inspectionTotalCost }}원</td>
              <td>{{ treatmentTotalCost }}</td>
              <td>{{ medicineTotalCost }}원</td>
              <td>{{ totalCost }}원</td>
            </tr>
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
  color: black;
  inline-size: 100%;
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
