<script lang="ts" setup>
import PatientPill from '@/exampleJson/PatientPill.json'
import { IdStore, mediStore } from '@/store/index'
import { ref, watch } from 'vue'
import Scan from './Scan.vue'
import ScanMD from './ScanMedi.vue'
import MedicationsData from './medications.interface'
const store = mediStore()
const userStore = IdStore()
interface Medication {
  code: string
  name: string
  type: string
  description: string
}

// 예시 데이터
const medicationsData: MedicationsData = {
  medications: [
    {
      code: 'ABC123',
      name: '판콜',
      type: '진통제',
      description: '두통 및 통증 완화에 사용되는 일반적인 진통제입니다.',
    },
    {
      code: 'DEF456',
      name: '비타민 C',
      type: '비타민',
      description: '면역 강화 및 각종 질병 예방에 도움을 주는 비타민 C입니다.',
    },
    {
      code: 'GHI789',
      name: '레보세트',
      type: '해열제',
      description: '열이 나거나 발열을 완화하기 위해 사용되는 약물입니다.',
    },
    {
      code: 'XYZ789',
      name: '페리린',
      type: '진통제',
      description: '통증 완화 및 염증 감소에 도움을 주는 진통제입니다.',
    },
    {
      code: 'LMN456',
      name: '아세트아미노펜',
      type: '해열제',
      description: '열이 나거나 발열을 완화하기 위해 사용되는 해열제입니다.',
    },
    {
      code: 'OPQ123',
      name: '비타민 D',
      type: '비타민',
      description: '뼈와 치아 형성, 면역 강화에 도움을 주는 비타민 D입니다.',
    },
    {
      code: 'JKL456',
      name: '에너지부스트',
      type: '영양제',
      description: '체력과 에너지를 증진시키는 영양 보충제입니다.',
    },
    {
      code: 'MNO789',
      name: '비타민 B12',
      type: '비타민',
      description: '신경 기능 개선 및 혈액 형성에 도움을 주는 비타민 B12입니다.',
    },
    {
      code: 'PQR012',
      name: '철분 보충제',
      type: '영양제',
      description: '빈혈 예방 및 철분 공급에 도움을 주는 철분 보충제입니다.',
    },
  ],
}
const searchedMedicationCode = ref('')
const medicationNotFound = ref(false)
const patient = ref(PatientPill[0].patient)
const prescription = ref(PatientPill[0].prescription)
const searchedMedications = ref<MedicationsData['medications']>([])

const medicationCode = ref('')
const searchedMedication = ref<MedicationsData['medications'][number] | null>(null)
const searchAttempted = ref(false)

const searchMedication = () => {
  if (store.id) medicationCode.value = store.id
  const code = medicationCode.value.trim().toUpperCase()
  // store.id = code
  // console.log(store.id)
  searchAttempted.value = true
  searchedMedicationCode.value = code
  medicationNotFound.value = isMedicationFound(searchedMedicationCode)
  if (code) {
    const foundMedication = findMedicationByCode(code)
    searchedMedication.value = foundMedication || null
  } else {
    searchedMedication.value = null
  }
}
function isMedicationFound(code) {
  const inputCode = medicationCode.value.trim().toUpperCase()
  // medicationCode.value = ''
  store.id = ''
  const foundMedication = prescription.value.medications.find(medication => medication.code === inputCode)
  console.log(prescription.value)
  // console.log(foundMedication.code + inputCode)
  if (foundMedication && foundMedication.code === inputCode) return true
  else {
    return false
  }
}

const findMedicationByCode = (code: string) => {
  // medicationsData는 외부에서 가져온 데이터 혹은 API 호출을 통해 가져온 데이터일 것입니다.
  return medicationsData.medications.find(medication => medication.code === code)
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
const isMDScanOpen = ref(false)

const openScan = () => {
  console.log(isScanOpen.value)
  isScanOpen.value = true
  console.log(isScanOpen.value)
}

const openMDScan = () => {
  console.log(isScanOpen.value)
  isMDScanOpen.value = true
  console.log(isScanOpen.value)
}
const foundPatient = ref(null)

const searchPatient = () => {
  foundPatient.value = PatientPill.find(patient => patient.patient.code === userStore.id)
  pillInfo.value = foundPatient.value
  prescription.value = pillInfo.value.prescription
  console.log(pillInfo.value)
}
watch(
  () => userStore.id,
  () => {
    searchPatient()
  },
)
const pillInfo = ref(PatientPill[0])
watch(
  () => store.id,
  (newId, oldId) => {
    // 여기서 원하는 로직을 수행
    searchMedication()
    // 변경된 ID에 따라 특정 함수 호출 등의 로직을 추가할 수 있음
    // 예: fetchData(newId);
  },
)
</script>

<template>
  <div class="auth-wrapper d-flex">
    <VCol>
      <VCard class="mb-3">
        <VCol
          cols="12"
          md="6"
        >
          <h2 class="PatientName">{{ pillInfo.patient.name }}</h2>
        </VCol>
      </VCard>
      <VRow>
        <VCol cols="6">
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

        <VCol cols="6">
          <VCard class="user_list scroll-container">
            <VCardItem class="justify-center">
              <VCardTitle class="font-weight-semibold text-2xl text-uppercase">
                PILL LIST
                <ScanMD v-model="isMDScanOpen" />
                <VBtn @click="openMDScan">Scan</VBtn></VCardTitle
              >
            </VCardItem>

            <VDivider />

            <VCardText>
              <div>
                <label for="medicationCode">약물 코드:</label>
                <input
                  v-model="medicationCode"
                  type="text"
                />
                <button @click="searchMedication">약물 조회</button>
                <div class="ma-5"></div>
                <div
                  v-if="searchedMedication"
                  :class="medicationNotFound ? 'found-medication' : 'not-found'"
                >
                  <h3>조회 결과:</h3>
                  <p>이름: {{ searchedMedication.name }}</p>
                  <p>종류: {{ searchedMedication.type }}</p>
                  <p>설명: {{ searchedMedication.description }}</p>
                </div>

                <div v-if="!searchedMedication && searchAttempted">
                  <p>일치하는 약물을 찾을 수 없습니다.</p>
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCol>
  </div>
</template>

<style scoped>
/* 스타일 정보는 이전 HTML 예제와 유사하므로 생략했습니다. */
.not-found {
  background-color: red; /* 검색이 안되었을 때 전체 행을 빨간색으로 설정 */
}

.found-medication {
  background-color: green; /* 검색이 되었을 때 전체 행을 초록색으로 설정 */
}

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
