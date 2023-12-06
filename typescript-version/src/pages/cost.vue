<script setup lang="ts">
import { IdStore } from '@/store';
import DemoSimpleTableBasics from '@/views/pages/tables/DemoSimpleTableBasics.vue';
import DemoSimpleTableDensity from '@/views/pages/tables/DemoSimpleTableDensity.vue';
import DemoSimpleTableTheme from '@/views/pages/tables/DemoSimpleTableTheme.vue';
import { useRoute } from 'vue-router';
import patientData from '../exampleJson/patient.json';
import Inspection from '@/exampleJson/inspection.json'
import costData from '@/exampleJson/Cost.json'
const store = IdStore();

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  diagnosis: string;
}

interface Inspection {
  patientId: number,
  patientName: string,
  inspectionName: string[],
  medicineName: string[]
}

interface Cost {
  id: number,
  name: string,
  cost: number
}

interface CostData {
  inspectionCost: Cost[],
  medicineCost: Cost[]
}

const route = useRoute();
interface PatientsData {
  patients: Patient[];
}
const patientsData: PatientsData = patientData;

const patientInfo = ref<Patient | undefined>(undefined);

const getUserInfoByID = () => {
  // Update the value of patientInfo
  patientInfo.value = patientsData.patients.find(patient => patient.id === Number(store.id));
  console.log(store.id);
}

watchEffect(() => {
  console.log(`ID changed to ${store.id}`);
  getUserInfoByID();
});
getUserInfoByID();


// 검사 목록 불러오기
const inspectionData: Ref<Inspection[] | null> = ref(null)

onMounted(async () => {
  inspectionData.value = Inspection.inspection
})

// 선택한 환자의 청구 비용만 나오도록 필터링
const filteredInspectionData = computed(() => {
  return inspectionData.value?.filter(item => item.patientId === patientInfo.value?.id) || []
})

// 검사 비용 데이터
const costs: CostData = costData

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
  let inspectionSum = 0
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
      <!-- 검사 비용 -->
      <VCard>
        <VCardTitle>검사비</VCardTitle>

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

    <!-- 처방 비용 -->
    <VCol cols="12" md="6">
      <VCard>
        <VRow>
          <VCol cols="12">
            <VCardTitle>약제비</VCardTitle>
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
            <th>검사비용</th>
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
