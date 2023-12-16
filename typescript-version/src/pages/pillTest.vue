<template>
  <div class="auth-wrapper d-flex">
    <VCol>
      <VCard class="ma-5">
        <VCol
          cols="12"
          md="3"
        >
          <VCardText class="PatientName">{{ pillInfo.patient.name }} ({{ pillInfo.patient.code }} )</VCardText>
        </VCol>
      </VCard>
      <VRow>
        <VCol cols="6">
          <VCard class="user_list scroll-container">
            <VCardItem class="justify-center">
              <VCardTitle class="font-weight-semibold text-2xl text-uppercase"> PILL LIST </VCardTitle>
            </VCardItem>

            <VDivider />

            <VCardText>
              <table class="list_table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Usage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in pillInfo.prescription.medications"
                    :key="item.code"
                  >
                    <td>{{ item.code }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.dosage }}</td>
                  </tr>
                </tbody>
              </table>
            </VCardText>
          </VCard>
        </VCol>

        <VCol cols="6">
          <!-- USER LIST  -->
          <VCard class="user_list scroll-container">
            <VCardItem class="justify-center">
              <VCardTitle class="font-weight-semibold text-2xl text-uppercase">
                PILL LIST <Scan v-model="isScanOpen" /> <VBtn @click="openScan">Scan</VBtn></VCardTitle
              >
            </VCardItem>

            <VDivider />

            <VCardText>
              <table class="list_table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Usage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in pillInfo.prescription.medications"
                    :key="item.code"
                  >
                    <td>{{ item.code }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.dosage }}</td>
                  </tr>
                </tbody>
              </table>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCol>
  </div>
</template>

<script lang="ts" setup>
import PatientPill from '@/exampleJson/PatientPill.json'
import Scan from './Scan.vue'

interface Medication {
  code: string
  name: string
  dosage: string
}

interface Patient {
  code: string
  name: string
  age: number
  gender: string
}

interface Prescription {
  symptoms: string[]
  medications: Medication[]
}

interface PrescriptionRecord {
  patient: Patient
  prescription: Prescription
}
// 모달창 구현
const isScanOpen = ref(false)
const openScan = () => {
  console.log(isScanOpen.value)
  isScanOpen.value = true
  console.log(isScanOpen.value)
}

let pillInfo = PatientPill
</script>

<style scoped>
/* 스타일 정보는 이전 HTML 예제와 유사하므로 생략했습니다. */

.auth-card {
  align-content: center;
  block-size: 77.77vh;
}

.auth-card div {
  margin-block-start: 20px;
}

.PatientName {
  font-size: 20px;
}

.user_list {
  block-size: 77.77vh;
}

.user_form {
  padding: 14px;
}

.list_table div {
  margin-block-start: 20px;
  text-align: end;
}

input {
  padding: 6px; /* 입력 텍스트와 테두리 간의 여백 */

  /* 테두리 스타일 및 색상 설정 */
  border: 2px solid grey; /* 예시: 파란색 테두리 */
  border-radius: 5px; /* 테두리 모서리의 둥근 정도 */
  padding-inline: 8px;
}

.list_table {
  border-collapse: separate; /* 셀 경계를 분리합니다. */
  border-spacing: 10px; /* 원하는 간격으로 설정합니다. */
  inline-size: 100%;
}

/* 예시 스타일 */
.list_table th,
.list_table td {
  padding: 5px; /* 셀 안의 내용과 경계 사이의 여백을 조절합니다. */
  text-align: center;
}

.edit,
.delete {
  margin: 3px;
}

.scroll-container {
  padding: 10px; /* 패딩 설정 */
  border: 1px solid #ccc; /* 경계선 스타일 */
  overflow-y: auto; /* 높이를 초과하면 y축 스크롤 바 표시 */
}
</style>
