// 추가로 필요한 것
// 추가 눌렀을 시 모달창 띄우기, 모달창에서 원하는 요소 3가지(개수는 노상관) 추가하기
// 추가한 요소들 그래프로 보여주기
// 초기화 누르면 그래프 소멸 후 다시 추가 버튼 등장
<script setup lang="ts">
import NewPatientRegistration from '@/views/pages/account-settings/NewPatientRegistration.vue'
import avatar1 from '@images/avatars/avatar-1.png'
import axios from 'axios'
import { Ref } from 'vue'
import { useRoute } from 'vue-router'
import PatientData from './PatientData.json'
import BloodPressureTest from '@/views/pages/statistics/BloodPressureTest.vue'
import BloodTest from '@/views/pages/statistics/BloodTest.vue'
import PhysicalInformation from '@/views/pages/statistics/PhysicalInformation.vue'
import PhysicalAbility from '@/views/pages/statistics/PhysicalAbility.vue'

const route = useRoute()

const accountData = {
  avatarImg: avatar1,
}

const refInputEl = ref<HTMLElement>()

const accountDataLocal = ref(structuredClone(accountData))

// 모달창 구현
const isModalOpen = ref(false)
const openModal = () => {
  isModalOpen.value = true
}

// 사진 교체
const changeAvatar = (file: Event) => {
  const fileReader = new FileReader()
  const { files } = file.target as HTMLInputElement

  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') accountDataLocal.value.avatarImg = fileReader.result
    }
  }
}

// 환자 정보 검색

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
      // '전화번호' 선택
      else if (searchCondition.value === '전화번호') {
        searchResults.splice(
          0,
          searchResults.length,
          ...patients.filter(patient => patient.phone.includes(searchTerm.value)),
        )
      }
      // '이름' 선택
      else if (searchCondition.value === '이름') {
        searchResults.splice(
          0,
          searchResults.length,
          ...patients.filter(patient => patient.name.includes(searchTerm.value)),
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
}

const statisticsroute = useRoute()

const activeTab = ref(statisticsroute.params.tab)

const tabs = [
  { title: '운동능력', icon: 'mdi-camera', tab: 'image' },
  { title: '검사', icon: 'mdi-water', tab: 'blood' },
]
</script>

<template>
  <!-- 검색창 및 신규 환자 등록 버튼 -->
  <div class="d-flex h-100 align-center">
    <!-- 검색 버튼 -->
    <IconBtn>
      <VIcon icon="mdi-magnify" />
    </IconBtn>

    <div class="search-container">
      <!-- 검색창 -->
      <div
        class="d-flex align-center cursor-pointer"
        style="user-select: none"
      >
        <!-- <input type="text" v-model="searchTerm" placeholder="환자 검색" @input="search"> -->
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
            :key="result.id"
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
                  <VCardText>ID: {{ result.id }}</VCardText>
                </VCol>

                <VCol
                  cols="12"
                  md="3"
                >
                  <VCardText>이름: {{ result.name }}</VCardText>
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <VCardText>주민등록번호: {{ result.firstRRN }} - {{ result.lastRRN }}</VCardText>
                </VCol>
              </VRow>
              <VCardText class="mt-0">전화번호: {{ result.phone }}</VCardText>
            </VCard>
          </div>
        </div>
        <div class="search-condition ml-2">
          <VSelect
            label="검색 조건"
            v-model="searchCondition"
            :items="['선택 안함', '환자 ID', '이름', '전화번호']"
          />
        </div>
      </div>
    </div>
  </div>

  <VDivider style="margin-top: 20px; margin-bottom: 30px" />

  <div>
    <VTabs
      v-model="activeTab"
      show-arrows
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>

    <VDivider />

    <VWindow
      v-model="activeTab"
      class="mt-5 disable-tab-transition"
    >
      <!-- 운동능력 -->
      <VWindowItem value="image">
        <VCard
          class="card-style"
          title="운동능력"
        >
          <PhysicalAbility />
        </VCard>
        <VCard
          class="card-style"
          title="신체정보"
        >
          <PhysicalInformation />
        </VCard>
      </VWindowItem>

      <!-- 검사 -->
      <VWindowItem value="blood">
        <VCard
          class="card-style"
          title="혈액검사"
        >
          <BloodTest />
        </VCard>
        <VCard
          class="card-style"
          title="혈압검사"
        >
          <BloodPressureTest />
        </VCard>
      </VWindowItem>
    </VWindow>
  </div>
</template>

<style lang="scss">
@use '@core/scss/pages/page-auth.scss';

.stat-btn {
  padding: 8px;
  border: 3px solid blueviolet;
  border-radius: 7px;
  font-size: 14px;
}

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

/* 환자 사진 스타일 */
.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 100%;
  inline-size: 100%;
  justify-items: center;
}

.avatar {
  block-size: 100%;
  inline-size: 150px;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  transform: translate(-15%, -50%);
}

.avatar img {
  block-size: 100%;
  inline-size: 100%;
  object-fit: cover;
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
  width: 550px;
}

.search-condition {
  width: 140px;
}

.card-style {
  margin: 30px;
  padding: 20px;
}
</style>
