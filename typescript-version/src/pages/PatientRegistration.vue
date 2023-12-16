<script lang="ts" setup>
import NewPatientRegistration from '@/views/pages/account-settings/NewPatientRegistration.vue'
<<<<<<< Updated upstream
import axios from 'axios'
import { Ref } from 'vue'
import { useRoute } from 'vue-router'
=======
import avatar1 from '@images/avatars/avatar-1.png'
import axios from 'axios'
import { Ref } from 'vue'
import { useRoute } from 'vue-router'
import PatientData from './PatientData.json'
>>>>>>> Stashed changes

const route = useRoute()

// 인터페이스
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

interface Reception {
  reception: string
  visit_reason: string
  reception_date: string
  reception_date_only: string
  patient: {
    patient_id: string
    patient_name: string
    patient_gender: string
    patient_birthday: string
    patient_residence_number: string
    patient_phone_number: string
    patient_emergency_phone_number: string
    patient_address: string
  }
}

// 모달창 구현
const isModalOpen = ref(false)
const openModal = () => {
  isModalOpen.value = true
}

// 백엔드에서 환자 정보 받아오기
let patientInformation = ref<Patient[]>([])

<<<<<<< Updated upstream
onMounted(async () => {
  try {
    const response = await axios.get('http://yunsseong.uk:8000/api/patients/')
    patientInformation.value = response.data
    console.log('patient data loding success')
  } catch (error) {
    console.error(error)
  }
})

// 백엔드에서 접수 정보 받아오기
let receptionInformation = ref<Reception[]>([])

const loadReceptionData = async () => {
  console.log('load reception_data')
  try {
    console.log(selectedPatient.value?.patient_id)
    const response = await axios.get(
      `http://yunsseong.uk:8000/api/receptions?patient=${selectedPatient.value?.patient_id}`,
    )
    receptionInformation.value = response.data
    console.log('reception_data loading success')

    return response.data.map((item: Reception) => {
      return {
        ...item,
        reception_date_only: item.reception_date.split('T')[0],
      }
    })
  } catch (error) {
    console.error(error)
  }
}

// 환자 리스트에 접수 환자 추가
const addList = async () => {
  try {
    const patientID = selectedPatient.value?.patient_id

    const data = {
      patient: patientID,
=======
  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') accountDataLocal.value.avatarImg = fileReader.result
>>>>>>> Stashed changes
    }

    const response = await axios.post(`http://yunsseong.uk:8000/api/list/`, data)
  } catch (error) {
    console.error(error)
  }
}

// 백엔드로 접수 정보 전송
const submitForm = async () => {
  try {
    const patientID = selectedPatient.value?.patient_id
    const visit_reason = visitReason.value

    const data = {
      patient: patientID,
      visit_reason: visit_reason,
    }

    console.log(data)
    const response = await axios.post(`http://yunsseong.uk:8000/api/receptions/`, data)
    console.log('Submit success')

    await addList() // 환자 리스트에 접수된 환자 추가
    console.log('Add list success')

    location.reload() // 페이지 새로고침
  } catch (error) {
    console.error(error)
  }
}

// 환자 정보 검색
<<<<<<< Updated upstream
const searchTerm: Ref<string> = ref('')
const searchResults = reactive<Patient[]>([])
const selectedPatient = ref<Patient | null>(null)
const receptionData = ref<Reception[] | null>(null)
const searchCondition: Ref<string> = ref('선택 안함')
const visitReason = ref('')

const search = (event: Event) => {
  searchTerm.value = (event.target as HTMLInputElement).value
  if (searchTerm.value && Array.isArray(patientInformation.value)) {
    // 검색 조건을 선택 안했을 때
    if (searchCondition.value == '선택 안함') {
      searchResults.splice(
        0,
        searchResults.length,
        ...patientInformation.value.filter(
          patient =>
            patient.patient_name.includes(searchTerm.value) || patient.patient_phone_number.includes(searchTerm.value),
        ),
      )
      // 검색 조건 선택했을 때
    } else {
=======

// json 양식
interface Patient {
  id: number
  name: string
  age: number
  gender: string
  firstRRN: string
  lastRRN: string
  address: string
  phone: string
  emergencyPhone: string
  firstVisit: string
  lastVisit: string
  diagnosis: string
  admitted: boolean
  record: string[]
}
const patients = reactive<Patient[]>(PatientData.patients)
const searchTerm: Ref<string> = ref('')
const searchResults = reactive<Patient[]>([])
const selectedPatient = ref<Patient | null>(null)
const searchCondition: Ref<string> = ref('선택 안함')

const search = (event: Event) => {
  searchTerm.value = (event.target as HTMLInputElement).value
  if (searchTerm.value) {
    // 검색 조건을 선택 안했을 때
    if (searchCondition.value == '선택 안함') {
      // 검색어가 숫자로만 구성 -> id에서만 검색
      if (/^\d+$/.test(searchTerm.value)) {
        searchResults.splice(
          0,
          searchResults.length,
          ...patients.filter(patient => patient.id.toString().includes(searchTerm.value)),
        )
      }
      // 그렇지 않은 경우 이름이나 전화번호로 검색
      else {
        searchResults.splice(
          0,
          searchResults.length,
          ...patients.filter(
            patient => patient.name.includes(searchTerm.value) || patient.phone.includes(searchTerm.value),
          ),
        )
      }
      // 검색 조건 선택했을 때
    } else {
      // '환자 ID' 선택
      if (searchCondition.value === '환자 ID') {
        searchResults.splice(
          0,
          searchResults.length,
          ...patients.filter(patient => patient.id.toString().includes(searchTerm.value)),
        )
      }
>>>>>>> Stashed changes
      // '전화번호' 선택
      if (searchCondition.value === '전화번호') {
        searchResults.splice(
          0,
          searchResults.length,
<<<<<<< Updated upstream
          ...patientInformation.value.filter(patient => patient.patient_phone_number.includes(searchTerm.value)),
=======
          ...patients.filter(patient => patient.phone.includes(searchTerm.value)),
>>>>>>> Stashed changes
        )
      }
      // '이름' 선택
      else if (searchCondition.value === '이름') {
        searchResults.splice(
          0,
          searchResults.length,
<<<<<<< Updated upstream
          ...patientInformation.value.filter(patient => patient.patient_name.includes(searchTerm.value)),
=======
          ...patients.filter(patient => patient.name.includes(searchTerm.value)),
>>>>>>> Stashed changes
        )
      }
    }
  } else {
    searchResults.splice(0, searchResults.length)
  }
}

const selectPatient = (patient: Patient | null) => {
  selectedPatient.value = patient
  searchResults.splice(0, searchResults.length)
<<<<<<< Updated upstream
  loadReceptionData().then(data => {
    receptionData.value = data
    console.log(receptionData.value)
  })
=======
}

// 백엔드로 환자 정보 전송
const submitForm = async () => {
  try {
    const response = await axios.put('http://your-server.com/api/patient/{{ patient_id }}', accountDataLocal.value)
    if (response.status === 200) {
      console.log('Data submitted successfully')
    } else {
      console.log('Failed to submit data')
    }
  } catch (error) {
    console.error(error)
  }
>>>>>>> Stashed changes
}
</script>

<template>
  <!-- 검색창 및 신규 환자 등록 버튼 -->
  <div class="d-flex h-100 align-center">
    <div class="search-container">
      <!-- 검색창 -->
      <div
        class="d-flex align-center cursor-pointer"
        style="user-select: none"
      >
        <VTextField
          type="text"
          v-model="searchTerm"
          label="환자 검색"
          @input="search"
        />
        <div
          class="search-results"
          v-if="searchResults.length"
        >
          <div
            v-for="result in searchResults"
<<<<<<< Updated upstream
            :key="result.patient_id"
=======
            :key="result.id"
>>>>>>> Stashed changes
            @click="selectPatient(result)"
          >
            <!-- 환자 선택 시 검색창 초기화 -->
            <VCard
              class="mt-1"
              id="autoSearch"
              @click="searchTerm = ''"
            >
              <VRow class="mb-0">
                <VCol
                  cols="12"
<<<<<<< Updated upstream
                  md="8"
                >
                  <VCardText>ID: {{ result.patient_id }}</VCardText>
=======
                  md="3"
                >
                  <VCardText>ID: {{ result.id }}</VCardText>
>>>>>>> Stashed changes
                </VCol>

                <VCol
                  cols="12"
                  md="3"
                >
<<<<<<< Updated upstream
                  <VCardText>이름: {{ result.patient_name }}</VCardText>
=======
                  <VCardText>이름: {{ result.name }}</VCardText>
>>>>>>> Stashed changes
                </VCol>

                <VCol
                  cols="12"
<<<<<<< Updated upstream
                  md="5"
                >
                  <VCardText>주민등록번호: {{ result.patient_residence_number }}</VCardText>
                </VCol>

                <VCol>
                  <VCardText class="mt-0">전화번호: {{ result.patient_phone_number }}</VCardText>
=======
                  md="6"
                >
                  <VCardText>주민등록번호: {{ result.firstRRN }} - {{ result.lastRRN }}</VCardText>
>>>>>>> Stashed changes
                </VCol>
              </VRow>
            </VCard>
          </div>
        </div>
        <div class="search-condition ml-2">
          <VSelect
            label="검색 조건"
            v-model="searchCondition"
<<<<<<< Updated upstream
            :items="['선택 안함', '이름', '전화번호']"
=======
            :items="['선택 안함', '환자 ID', '이름', '전화번호']"
>>>>>>> Stashed changes
          />
        </div>
      </div>
    </div>

    <VSpacer />

    <!-- 신규 환자 등록 버튼 -->
    <NewPatientRegistration v-model="isModalOpen" />

    <VBtn @click="openModal">신규 환자 등록</VBtn>
  </div>

  <VDivider class="mt-2" />

  <VCard class="mt-4">
    <template v-slot:title>
      <div class="d-flex align-center justify-space-between">
<<<<<<< Updated upstream
        환자 접수
=======
        기존 환자 접수
>>>>>>> Stashed changes
        <VBtn
          color="primary"
          @click="submitForm"
          >접수</VBtn
        >
      </div>
    </template>
    <VDivider class="mb-1" />

    <!-- 환자 기본 정보 -->
    <VRow>
      <VCol cols="12">
        <VRow>
<<<<<<< Updated upstream
          <VCol cols="12">
            <VRow>
              <VCol
                cols="12"
                md="8"
              >
                <VCardText>
                  이름 : {{ selectedPatient?.patient_name }} (환자ID : {{ selectedPatient?.patient_id }})
                </VCardText>
=======
          <VCol
            cols="12"
            md="2"
          >
            <!-- 환자 사진 -->
            <VCardText class="d-flex avatar-container">
              <VAvatar
                rounded="lg"
                class="me-6 cursor-pointer avatar"
                :image="accountDataLocal.avatarImg"
                @click="refInputEl?.click()"
              />

              <!-- 사진 클릭 시 사진 업로드 -->
              <form class="d-flex flex-column justify-center gap-5">
                <div class="d-flex flex-wrap gap-2">
                  <input
                    ref="refInputEl"
                    type="file"
                    name="file"
                    accept=".jpeg,.png,.jpg,GIF"
                    hidden
                    @input="changeAvatar"
                  />
                </div>
              </form>
            </VCardText>
          </VCol>
          <VCol
            cols="12"
            md="10"
          >
            <VRow>
              <VCol
                cols="12"
                md="4"
              >
                <VCardText> 이름 : {{ selectedPatient?.name }}(환자ID : {{ selectedPatient?.id }}) </VCardText>
>>>>>>> Stashed changes
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
<<<<<<< Updated upstream
                <VCardText> 성별 : {{ selectedPatient?.patient_gender }} </VCardText>
=======
                <VCardText> 성별 : {{ selectedPatient?.gender }} </VCardText>
>>>>>>> Stashed changes
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
<<<<<<< Updated upstream
                <VCardText> 생년월일 : {{ selectedPatient?.patient_birth }} </VCardText>
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <VCardText> 주민등록번호 : {{ selectedPatient?.patient_residence_number }} </VCardText>
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <VCardText> 주소 : {{ selectedPatient?.patient_address }} </VCardText>
=======
                <VCardText> 나이 : {{ selectedPatient?.age }} </VCardText>
>>>>>>> Stashed changes
              </VCol>
            </VRow>
            <VRow>
              <VCol
                cols="12"
<<<<<<< Updated upstream
                md="4"
              >
                <VCardText> 연락처 : {{ selectedPatient?.patient_phone_number }} </VCardText>
=======
                md="6"
              >
                <VCardText> 주민등록번호 : {{ selectedPatient?.firstRRN }} - {{ selectedPatient?.lastRRN }} </VCardText>
>>>>>>> Stashed changes
              </VCol>

              <VCol
                cols="12"
<<<<<<< Updated upstream
                md="4"
              >
                <VCardText> 비상 연락처 : {{ selectedPatient?.patient_emergency_phone_number }} </VCardText>
=======
                md="6"
              >
                <VCardText> 주소 : {{ selectedPatient?.address }} </VCardText>
>>>>>>> Stashed changes
              </VCol>
            </VRow>
          </VCol>
        </VRow>
        <VRow class="ml-3">
<<<<<<< Updated upstream
          <!--
          <VCol cols="12" md="4">
            <VCardText>
              약관 동의 여부 : {{ selectedPatient?.admitted ? '동의' : '비동의' }}
            </VCardText>
=======
          <VCol
            cols="12"
            md="4"
          >
            <VCardText> 연락처 : {{ selectedPatient?.phone }} </VCardText>
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <VCardText> 비상 연락처 : {{ selectedPatient?.emergencyPhone }} </VCardText>
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <VCardText> 약관 동의 여부 : {{ selectedPatient?.admitted ? '동의' : '비동의' }} </VCardText>
>>>>>>> Stashed changes
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <VCardText> 최초 방문일 : {{ selectedPatient?.firstVisit }} </VCardText>
          </VCol>

<<<<<<< Updated upstream
          <VCol cols="12" md="4">
            <VCardText>
              최근 방문일 : {{ selectedPatient?.lastVisit }}
            </VCardText>
          </VCol>-->
=======
          <VCol
            cols="12"
            md="4"
          >
            <VCardText> 최근 방문일 : {{ selectedPatient?.lastVisit }} </VCardText>
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <VCardText> 증상 : {{ selectedPatient?.diagnosis }} </VCardText>
          </VCol>
>>>>>>> Stashed changes
        </VRow>
      </VCol>
    </VRow>
  </VCard>

  <VDivider class="mt-4" />

  <VRow class="mt-0 d-flex">
    <!-- 내원 기록 -->
    <VCol
      cols="12"
      md="6"
    >
      <VCard
        title="내원 기록"
        class="full-height"
      >
        <VDivider />

        <VCardText>
          <div class="scrollable-area">
            <div
              v-for="(info, index) in receptionData"
              :key="index"
            >
              {{ index + 1 }}. 방문 날짜 : {{ info.reception_date_only }} / 방문 사유 : {{ info.visit_reason }}
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 방문 사유 -->
    <VCol
      cols="12"
      md="6"
    >
      <VCard
<<<<<<< Updated upstream
        title="방문 사유"
=======
        title="재방문 사유"
>>>>>>> Stashed changes
        class="full-height"
      >
        <VDivider />
        <VCol>
          <div>
            <VTextarea
              label="방문 사유 기입"
              v-model="visitReason"
            ></VTextarea>
          </div>
        </VCol>
      </VCard>
    </VCol>
  </VRow>
</template>

<style scoped>
/* 검색어 자동 완성 스타일 */
.search-container {
  position: relative;
  inline-size: 70%;
}

.search-results {
  position: absolute;
  z-index: 999;
  inline-size: 30%;
  inset-block-start: 100%;
}

/* 내원 기록 카드 스크롤바 변환 및 재방문 사유 카드와 높이 맞춤 */
.full-height {
  block-size: 250px;
}

.scrollable-area {
  max-block-size: 135px;
  overflow-y: auto;
}

/* 검색어 자동완성 창 폭 조절 */
#autoSearch {
  inline-size: 550px;
}

.search-condition {
  inline-size: 125px;
}
</style>
