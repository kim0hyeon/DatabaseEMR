<script setup lang="ts">
import axios from 'axios'
import { Patient, Event } from "@/pages/interfaces";
import { Ref } from 'vue'

const token = sessionStorage.getItem('token')

const selectedHour = ref()
const selectedMinute = ref()

// 모달창 구현
const props = defineProps({
  modelValue: Boolean,
  date: String
})

const emit = defineEmits(['update:modelValue'])

let isOpen = ref(props.modelValue)

const closeModal = () => {
  isOpen.value = false
}

watch(
    () => props.modelValue,
    newVal => {
      isOpen.value = newVal
    },
    { immediate: true },
)

watch(
    () => isOpen.value,
    newVal => {
      if (props.modelValue !== newVal) {
        emit('update:modelValue', newVal)
      }
    },
)

watch(
    () => {
  return props.date
  },
  async (newDate, oldDate) => {
      console.log(`SelectedDate changed from ${ oldDate } to ${ newDate }`)
  }
)

// 환자 정보 검색
let patientInformation = ref<Patient[]>([])
const searchTerm: Ref<string> = ref('')
const searchResults = reactive<Patient[]>([])
const selectedPatient = ref<Patient>()
const searchCondition: Ref<string> = ref('선택 안함')

// 백엔드에서 환자 정보 받아오기
onMounted(async () => {
  try {
    const response = await axios.get('http://yunsseong.uk:8000/api/patients/', {
      headers: { Authorization: `Token ${token}` },
    })
    patientInformation.value = response.data
  } catch (error) {
    console.error(error)
  }
})

// 예약 일정을 백엔드에 포스트
const addReservation = (async () => {
  try {
    const data = {
      patient: selectedPatient.value?.patient_id,
      date: props.date,
      hour: selectedHour.value,
      minute: selectedMinute.value
    }

    const response = await axios.post(`http://yunsseong.uk:8000/api/reservation/`, data,{
      headers: { Authorization: `Token ${token}` },
    })
  } catch (error) {
    console.error(error)
  }

  closeModal()
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
</script>

<template>
  <VDialog
    v-model="isOpen"
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
            <v-btn @click="addReservation">선택</v-btn>
          </VCol>
          <VCol
            cols="12"
            md="1"
            class="mr-8"
          >
            <v-btn @click="closeModal">닫기</v-btn>
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
  inline-size: 550px;
}
</style>
