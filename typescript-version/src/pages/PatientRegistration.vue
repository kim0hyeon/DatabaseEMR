<script lang="ts" setup>
import NewPatientRegistration from '@/views/pages/account-settings/NewPatientRegistration.vue'
import { Patient, Reception } from "@/pages/interfaces";
import GenerateQR from "@/pages/generateQR.vue";
import axios from 'axios'
import QRCode from "qrcode";
import { Ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const token = sessionStorage.getItem('token')

// 모달창 구현
// 신규 환자 등록 모달
const isModalOpen = ref(false)
const openModal = () => {
  isModalOpen.value = true
}

// QR코드 생성 모달
const isQROpen = ref(false)
let selectedPatientId = ref('')
let selectedPatientQR = ref('')

const OpenQR = (patient_id: string, url: string) => {
  isQROpen.value = true
  selectedPatientId.value = patient_id
  selectedPatientQR.value = url
}

// 백엔드에서 환자 정보 받아오기
let patientInformation = ref<Patient[]>([])

onMounted(async () => {
  try {
    const response = await axios.get('http://yunsseong.uk:8000/api/patients/', {
      headers: { Authorization: `Token ${token}` },
    })
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
      { headers: { Authorization: `Token ${token}` } },
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
    }

    const response = await axios.post(`http://yunsseong.uk:8000/api/list/`, data, {
      headers: { Authorization: `Token ${token}` },
    })
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
    const response = await axios.post(`http://yunsseong.uk:8000/api/receptions/`, data, {
      headers: { Authorization: `Token ${token}` },
    })
    console.log('Submit success')

    await addList() // 환자 리스트에 접수된 환자 추가
    console.log('Add list success')

    location.reload() // 페이지 새로고침
  } catch (error) {
    console.error(error)
  }
}

// 환자 정보 검색
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
      // '전화번호' 선택
      if (searchCondition.value === '전화번호') {
        searchResults.splice(
          0,
          searchResults.length,
          ...patientInformation.value.filter(patient => patient.patient_phone_number.includes(searchTerm.value)),
        )
      }
      // '이름' 선택
      else if (searchCondition.value === '이름') {
        searchResults.splice(
          0,
          searchResults.length,
          ...patientInformation.value.filter(patient => patient.patient_name.includes(searchTerm.value)),
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
  loadReceptionData().then(data => {
    receptionData.value = data
    console.log(receptionData.value)
  })
}

// 환자 QR url 생성
let QR_url = ref('')

watch(() => selectedPatient.value, async (newVal) => {
  try {
    QR_url.value = await QRCode.toDataURL(newVal?.patient_id)
  } catch (err) {
    console.error('Error: ' + err)
  }
})
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
            :key="result.patient_id"
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
                  md="3"
                >
                  <VCardText>이름: {{ result.patient_name }}</VCardText>
                </VCol>

                <VCol
                  cols="12"
                  md="3"
                >
                  <VCardText>성별: {{ result.patient_gender }}</VCardText>
                </VCol>

                <VCol>
                  <VCardText>생년월일: {{ result.patient_birth }}</VCardText>
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <VCardText>
                    주민등록번호: {{ result.patient_birth }}-{{ result.patient_residence_number[0] }}******
                  </VCardText>
                </VCol>

                <VCol>
                  <VCardText class="mt-0">전화번호: {{ result.patient_phone_number }}</VCardText>
                </VCol>
              </VRow>
            </VCard>
          </div>
        </div>
        <div class="search-condition ml-2">
          <VSelect
            label="검색 조건"
            v-model="searchCondition"
            :items="['선택 안함', '이름', '전화번호']"
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
      <VRow>
        <VCol>
          <div class="d-flex align-center justify-space-between">
            환자 접수
          </div>
        </VCol>

        <VCol>
          <VBtn class="right-btn"
                color="primary"
                @click="submitForm">
            접수
          </VBtn>

          <GenerateQR v-model="isQROpen" :patient_id="selectedPatientId" :url="selectedPatientQR"/>
          <VBtn class="right-btn" @click="OpenQR(selectedPatient?.patient_id, QR_url)">
            QR코드 생성
          </VBtn>
        </VCol>
      </VRow>
    </template>
    <VDivider class="mb-1" />

    <!-- 환자 기본 정보 -->
    <VRow>
      <VCol cols="12">
        <VRow>
          <VCol cols="12">
            <VRow>
              <VCol
                cols="12"
                md="2"
              >
                <VCardText class="infoFont"> 이름 : {{ selectedPatient?.patient_name }} </VCardText>
              </VCol>

              <VCol
                cols="12"
                md="2"
              >
                <VCardText class="infoFont"> 성별 : {{ selectedPatient?.patient_gender }} </VCardText>
              </VCol>

              <VCol
                cols="12"
                md="3"
              >
                <VCardText class="infoFont"> 생년월일 : {{ selectedPatient?.patient_birth }} </VCardText>
              </VCol>

              <VCol
                cols="12"
                md="5"
              >
                <VCardText class="infoFont">
                  주민등록번호 : {{ selectedPatient?.patient_birth }}-{{
                    selectedPatient?.patient_residence_number[0]
                  }}******
                </VCardText>
              </VCol>
            </VRow>
            <VRow class="mt-0">
              <VCol
                cols="12"
                md="3"
              >
                <VCardText class="infoFont"> 연락처 : {{ selectedPatient?.patient_phone_number }} </VCardText>
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <VCardText class="infoFont">
                  비상 연락처 : {{ selectedPatient?.patient_emergency_phone_number }}
                </VCardText>
              </VCol>

              <VCol
                cols="12"
                md="5"
              >
                <VCardText class="infoFont"> 주소 : {{ selectedPatient?.patient_address }} </VCardText>
              </VCol>
            </VRow>

            <VRow class="mt-0">
              <VCol
                cols="12"
                md="3"
              >
                <VCardText class="infoFont">
                  필수 약관 동의 여부 : {{ selectedPatient?.patient_agree_essential_term ? '동의' : '비동의' }}
                </VCardText>
              </VCol>

              <VCol
                cols="12"
                md="3"
              >
                <VCardText class="infoFont">
                  선택 약관 동의 여부 : {{ selectedPatient?.patient_agree_optional_term ? '동의' : '비동의' }}
                </VCardText>
              </VCol>
            </VRow>
          </VCol>
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
        title="방문 사유"
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

.infoFont {
  font-size: 15px;
  font-weight: bold;
}

.right-btn {
  float: inline-end;
  margin-inline-start: 10px;
}
</style>
