<script setup lang="ts">
import PatientData from './PatientData.json'
import {is} from "quasar";
import {Ref} from "vue";
// json 양식
interface Patient {
  id: number
  name: string
  age: number
  gender: string,
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

interface Event {
  date: Date
  hour: number
  minute: number
  title: string
  diagnosis: string
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

const patients = reactive<Patient[]>(PatientData.patients)
const searchTerm: Ref<string> = ref('')
const searchResults = reactive<Patient[]>([])
const selectedPatient = ref<Patient | null>(null)
const searchCondition: Ref<string> =  ref('선택 안함')

const search = (event: Event) => {
  searchTerm.value = (event.target as HTMLInputElement).value;
  if (searchTerm.value) {
    // 검색 조건을 선택 안했을 때
    if (searchCondition.value == '선택 안함') {
      // 검색어가 숫자로만 구성 -> id에서만 검색
      if (/^\d+$/.test(searchTerm.value)) {
        searchResults.splice(
            0,
            searchResults.length,
            ...patients.filter((patient) =>
                patient.id.toString().includes(searchTerm.value)
            )
        );
      }
      // 그렇지 않은 경우 이름이나 전화번호로 검색
      else {
        searchResults.splice(
            0,
            searchResults.length,
            ...patients.filter((patient) =>
                patient.name.includes(searchTerm.value) ||
                patient.phone.includes(searchTerm.value)
            )
        );
      }
      // 검색 조건 선택했을 때
    } else {
      // '환자 ID' 선택
      if (searchCondition.value === '환자 ID') {
        searchResults.splice(
            0,
            searchResults.length,
            ...patients.filter((patient) =>
                patient.id.toString().includes(searchTerm.value)
            )
        );
      }
      // '전화번호' 선택
      else if (searchCondition.value === '전화번호') {
        searchResults.splice(
            0,
            searchResults.length,
            ...patients.filter((patient) =>
                patient.phone.includes(searchTerm.value)
            )
        );
      }
      // '이름' 선택
      else if (searchCondition.value === '이름') {
        searchResults.splice(
            0,
            searchResults.length,
            ...patients.filter((patient) =>
                patient.name.includes(searchTerm.value)
            )
        );
      }
    }
  } else {
    searchResults.splice(0, searchResults.length);
  }
}

const selectPatient = (patient: Patient | null) => {
  selectedPatient.value = patient
  searchResults.splice(0, searchResults.length);
}

const addEvent = (patient: Patient | null) => {
  events?.value.push({
    date: selectedDate?.value || new Date(),
    hour: selectedHour.value || 0,
    minute: selectedMinute.value || 0,
    title: patient?.name || '환자 이름 없음',
    diagnosis: patient?.diagnosis || '진단 정보 없음',
  })
  console.log(toRaw(selectedDate?.value));
  events.value.forEach(event => console.log(event));

  isPatientSearchOpen.value = false
  selectedPatient.value = null
  selectedMinute.value = null
  selectedHour.value = null
}

</script>

<template>
  <VDialog v-model="isPatientSearchOpen" max-width="1200px">
    <div>
      <VCard class="form">
        <VCardTitle class="headline mt-1">환자 예약</VCardTitle>
        <VRow class="mt-3 ml-3">
          <VCol cols="12">
            <div class="search-container">
              <!-- 검색창 -->
              <div
                class="d-flex align-center cursor-pointer"
                style="user-select: none;"
              >
                <VTextField
                  type="text" v-model="searchTerm"
                  label="환자 검색" @input="search"
                  class="searchField"
                />
                <div class="search-results" v-if="searchResults.length">
                  <div v-for="result in searchResults" :key="result.id" @click="selectPatient(result)">
                    <!-- 환자 선택 시 검색창 초기화 -->
                    <VCard class="mt-1" id="autoSearch" @click="searchTerm=''">
                      <VRow class="mb-0">
                        <VCol cols="12" md="3">
                          <VCardText>ID: {{ result.id }}</VCardText>
                        </VCol>

                        <VCol cols="12" md="3">
                          <VCardText>이름: {{ result.name }}</VCardText>
                        </VCol>

                        <VCol cols="12" md="6">
                          <VCardText>주민등록번호: {{ result.firstRRN }} - {{ result.lastRRN }}</VCardText>
                        </VCol>
                      </VRow>
                      <VCardText class="mt-0">전화번호: {{ result.phone }}</VCardText>
                    </VCard>
                  </div>
                </div>
                <div class="search-condition ml-2 ">
                  <VSelect label="검색 조건" v-model="searchCondition"
                           :items="['선택 안함','환자 ID', '이름', '전화번호']" />
                </div>
              </div>
            </div>
          </VCol>
        </VRow>

        <VRow class="ma-6">
          <VCard>
            <VCol cols="12">
              <VRow>
                <VCol cols="12" md="4">
                  <VCardText>
                    이름 : {{ selectedPatient?.name }}(환자ID : {{ selectedPatient?.id }})
                  </VCardText>
                </VCol>

                <VCol cols="12" md="4">
                  <VCardText>
                    성별 : {{ selectedPatient?.gender }}
                  </VCardText>
                </VCol>

                <VCol cols="12" md="4">
                  <VCardText>
                    나이 : {{ selectedPatient?.age }}
                  </VCardText>
                </VCol>

                <VCol cols="12" md="4">
                  <VCardText>
                    주민등록번호 : {{ selectedPatient?.firstRRN }} - {{ selectedPatient?.lastRRN }}
                  </VCardText>
                </VCol>

                <VCol cols="12" md="4">
                  <VCardText>
                    연락처 : {{ selectedPatient?.phone }}
                  </VCardText>
                </VCol>

                <VCol cols="12" md="4">
                  <VCardText>
                    비상 연락처 : {{ selectedPatient?.emergencyPhone }}
                  </VCardText>
                </VCol>

                <VCol cols="12" md="4">
                  <VCardText>
                    최초 방문일 : {{ selectedPatient?.firstVisit }}
                  </VCardText>
                </VCol>

                <VCol cols="12" md="4">
                  <VCardText>
                    최근 방문일 : {{ selectedPatient?.lastVisit }}
                  </VCardText>
                </VCol>

                <VCol cols="12" md="4">
                  <VCardText>
                    약관 동의 여부 : {{ selectedPatient?.admitted ? '동의' : '비동의' }}
                  </VCardText>
                </VCol>

                <VCol cols="12" md="5">
                  <VCardText>
                    주소 : {{ selectedPatient?.address }}
                  </VCardText>
                </VCol>

                <VCol cols="12" md="6">
                  <VCardText>
                    증상 : {{ selectedPatient?.diagnosis }}
                  </VCardText>
                </VCol>
              </VRow>
            </VCol>
          </VCard>
        </VRow>
        <VRow class="ml-4">
          <VCol cols="12" md="2">
            <VSelect
              v-model="selectedHour"
              :items="Array.from({ length: 24 }, (_, i) => i)"
              label="시간"
            />
          </VCol>

          <VCol cols="12" md="2">
            <VSelect
              v-model="selectedMinute"
              :items="Array.from({ length: 60 }, (_, i) => i)"
              label="분"
            />
          </VCol>

          <VSpacer/>

          <VCol cols="12" md="1" class="mr-0">
            <v-btn @click="addEvent(selectedPatient)">선택</v-btn>
          </VCol>
          <VCol cols="12" md="1" class="mr-8">
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

.form {
  height: 600px;
}

.times-container {
  width: 100%;
}
.times {
  border: solid black 1px;
  width: 100%;
}
</style>
