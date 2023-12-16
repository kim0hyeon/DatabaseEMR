<script setup lang="ts">
import PatientData from './PatientData.json'
import { is } from 'quasar'
import { Ref } from 'vue'
import axios from 'axios'
// json 양식
interface Patient {
  patient_id: string
  patient_name: string
  patient_gender: string
  patient_birthday: string
  patient_residence_number: string
  patient_phone_number: string
  patient_emergency_phone_number: string
  patient_address: string
}

interface Event {
  date: Date
  hour: number
  minute: number
  title: string
}

const selectedDate = inject<Ref<Date>>('selectedDate')
const isPatientSearchOpen = inject<Ref<boolean>>('isPatientSearchOpen', ref(false))
const events = ref<Event[]>([])
const selectedHour = ref()
const selectedMinute = ref()

provide('selectedHour', selectedHour)
provide('selectedMinute', selectedMinute)
provide('events', events)

const closePatientSearch = () => {
  isPatientSearchOpen.value = false
  selectedPatient.value = null
}

// 환자 정보 검색
let patientInformation = ref<Patient[]>([])
const searchTerm: Ref<string> = ref('')
const searchResults = reactive<Patient[]>([])
const selectedPatient = ref<Patient | null>(null)
const searchCondition: Ref<string> = ref('선택 안함')

// 백엔드에서 환자 정보 받아오기
onMounted(async () => {
  try {
    const response = await axios.get('http://yunsseong.uk:8000/api/patients/')
    patientInformation.value = response.data
    console.log('success')
  } catch (error) {
    console.error(error)
  }
})

const search = (event: InputEvent) => {
  searchTerm.value = (event.target as HTMLInputElement).value
  if (searchTerm.value && Array.isArray(patientInformation.value)) {
    // 검색 조건을 선택 안했을 때
    if (searchCondition.value == '선택 안함') {
      // 검색어가 숫자로만 구성 -> id에서만 검색
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
}

const addEvent = (patient: Patient | null) => {
  events?.value.push({
    date: selectedDate?.value || new Date(),
    hour: selectedHour.value || 0,
    minute: selectedMinute.value || 0,
    title: patient?.patient_name || '환자 이름 없음',
  })
  console.log(toRaw(selectedDate?.value))
  events.value.forEach(event => console.log(event))

  isPatientSearchOpen.value = false
  selectedPatient.value = null
  selectedMinute.value = null
  selectedHour.value = null
}
</script>

<template>
  <VDialog
    v-model="isPatientSearchOpen"
    max-width="1000px"
  >
    <div>
      <VCard class="form">
        <VCardTitle class="headline mt-1">환자 예약</VCardTitle>
        <VRow class="mt-1 ml-3">
          <VCol cols="12">
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
                          md="8"
                        >
                          <VCardText>ID: {{ result.patient_id }}</VCardText>
                        </VCol>

                        <VCol
                          cols="12"
                          md="3"
                        >
                          <VCardText>이름: {{ result.patient_name }}</VCardText>
                        </VCol>

                        <VCol
                          cols="12"
                          md="5"
                        >
                          <VCardText>주민등록번호: {{ result.patient_residence_number }}</VCardText>
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
          </VCol>
        </VRow>

        <VRow
          class="ma-6"
          style="width: 96%"
        >
          <VCard style="width: 100%">
            <VCol cols="12">
              <VRow>
                <VCol
                  cols="12"
                  md="8"
                >
                  <VCardText>
                    이름 : {{ selectedPatient?.patient_name }} (환자ID : {{ selectedPatient?.patient_id }})
                  </VCardText>
                </VCol>

                <VCol
                  cols="12"
                  md="4"
                >
                  <VCardText> 성별 : {{ selectedPatient?.patient_gender }} </VCardText>
                </VCol>

                <VCol
                  cols="12"
                  md="4"
                >
                  <VCardText> 생년월일 : {{ selectedPatient?.patient_birthday }} </VCardText>
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
                </VCol>
              </VRow>
              <VRow>
                <VCol
                  cols="12"
                  md="4"
                >
                  <VCardText> 연락처 : {{ selectedPatient?.patient_phone_number }} </VCardText>
                </VCol>

                <VCol
                  cols="12"
                  md="4"
                >
                  <VCardText> 비상 연락처 : {{ selectedPatient?.patient_emergency_phone_number }} </VCardText>
                </VCol>
              </VRow>
            </VCol>
          </VCard>
        </VRow>
        <VRow class="ml-4 mb-4">
          <VCol
            cols="12"
            md="2"
          >
            <VSelect
              v-model="selectedHour"
              :items="Array.from({ length: 24 }, (_, i) => i)"
              label="시간"
            />
          </VCol>

          <VCol
            cols="12"
            md="2"
          >
            <VSelect
              v-model="selectedMinute"
              :items="Array.from({ length: 60 }, (_, i) => i)"
              label="분"
            />
          </VCol>

          <VSpacer />

          <VCol
            cols="12"
            md="1"
            class="mr-0"
          >
            <v-btn @click="addEvent(selectedPatient)">선택</v-btn>
          </VCol>
          <VCol
            cols="12"
            md="1"
            class="mr-8"
          >
            <v-btn @click="closePatientSearch">닫기</v-btn>
          </VCol>
        </VRow>
      </VCard>
    </div>
  </VDialog>
</template>

<style scoped>
/* 검색어 자동 완성 스타일 */
.search-container {
  position: relative;
  inline-size: 98%;
}

.search-results {
  position: absolute;
  z-index: 999;
  inline-size: 30%;
  inset-block-start: 100%;
}

/* 검색어 자동완성 창 폭 조절 */
#autoSearch {
  width: 550px;
}
</style>
