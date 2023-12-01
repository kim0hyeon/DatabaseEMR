<script lang="ts" setup>
import NewPatientRegistration from '@/views/pages/account-settings/NewPatientRegistration.vue';
import avatar1 from "@images/avatars/avatar-1.png";
import axios from 'axios';
import { Ref } from "vue";
import { useRoute } from 'vue-router';
import PatientData from './PatientData.json';

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
      if (typeof fileReader.result === 'string')
        accountDataLocal.value.avatarImg = fileReader.result
    }
  }
}

// 환자 정보 검색

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

// 백엔드로 환자 정보 전송
const submitForm = async () => {
  try {
    const response = await axios.put('http://your-server.com/api/patient/{{ patient_id }}', accountDataLocal.value);
    if (response.status === 200) {
      console.log('Data submitted successfully');
    } else {
      console.log('Failed to submit data');
    }
  } catch (error) {
    console.error(error);
  }
}
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
        style="user-select: none;"
      >
        <!-- <input type="text" v-model="searchTerm" placeholder="환자 검색" @input="search"> -->
        <VTextField  type="text" v-model="searchTerm" label="환자 검색" @input="search" />
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

    <VSpacer/>

    <!-- 신규 환자 등록 버튼 -->
    <NewPatientRegistration v-model="isModalOpen" />

    <VBtn @click="openModal">신규 환자 등록</VBtn>
  </div>

  <VDivider class="mt-2"/>

  <VCard class="mt-4">
    <template v-slot:title>
      <div class="d-flex align-center justify-space-between">
        기존 환자 접수
        <VBtn color="primary" @click="submitForm">접수</VBtn>
      </div>
    </template>
    <VDivider class="mb-1"/>

    <!-- 환자 기본 정보 -->
    <VRow>
      <VCol cols="12" md="2">
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
              >
            </div>
          </form>
        </VCardText>
      </VCol>
      <VCol cols="12" md="10">
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
    </VRow>
  </VCard>

  <VDivider class="mt-4"/>

  <VRow class="mt-0 d-flex">
    <!-- 내원 기록 -->
    <VCol cols="12" md="6">
      <VCard title="내원 기록" class="full-height">

        <VDivider/>

        <VCardText>
          <div class="scrollable-area">
            <div v-for="record in selectedPatient?.record">
              {{ record }}
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 방문 사유 -->
    <VCol cols="12" md="6">
      <VCard title="재방문 사유" class="full-height">
        <VDivider/>
        <VCol>
          <div>
            <VTextarea label="재방문 사유 기입"></VTextarea>
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
  width: 125px;
}
</style>
