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

// 백엔드에서 환자 정보 받아오기
let patientInformation = ref<Patient[]>([]);

onMounted(async () => {
  try {
    const response = await axios.get('http://yunsseong.uk:8000/api/patient/');
    patientInformation.value = response.data;
    console.log('success')
  } catch (error) {
    console.error(error);
  }
});

onMounted(async () => {
  try {
    const response = await axios.get('http://yunsseong.uk:8000/api/patient/');
    patientInformation.value = response.data;
    console.log('success')
  } catch (error) {
    console.error(error);
  }
});

// 환자 정보 검색

// json 양식
interface Patient {
  patient_id: string
  patient_name: string
  patient_gender: string,
  patient_birthday: string,
  patient_residence_number: string,
  patient_phone_number: string,
  patient_emergency_phone_number: string,
  patient_address: string
}

const searchTerm: Ref<string> = ref('')
const searchResults = reactive<Patient[]>([])
const selectedPatient = ref<Patient | null>(null)
const searchCondition: Ref<string> =  ref('선택 안함')

const search = (event: Event) => {
  searchTerm.value = (event.target as HTMLInputElement).value;
  if (searchTerm.value && Array.isArray(patientInformation.value)) {
    // 검색 조건을 선택 안했을 때
    if (searchCondition.value == '선택 안함') {
      // 검색어가 숫자로만 구성 -> id에서만 검색
      searchResults.splice(
          0,
          searchResults.length,
          ...patientInformation.value.filter((patient) =>
              patient.patient_name.includes(searchTerm.value) ||
              patient.patient_phone_number.includes(searchTerm.value)
          )
      );
      // 검색 조건 선택했을 때
    } else {
      // '전화번호' 선택
      if (searchCondition.value === '전화번호') {
        searchResults.splice(
            0,
            searchResults.length,
            ...patientInformation.value.filter((patient) =>
                patient.patient_phone_number.includes(searchTerm.value)
            )
        );
      }
      // '이름' 선택
      else if (searchCondition.value === '이름') {
        searchResults.splice(
            0,
            searchResults.length,
            ...patientInformation.value.filter((patient) =>
                patient.patient_name.includes(searchTerm.value)
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
    const response = await axios.put('http://your-server.com/api/patient/{{ patientid }}', accountDataLocal.value);
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
        <VTextField  type="text" v-model="searchTerm" label="환자 검색" @input="search" />
        <div class="search-results" v-if="searchResults.length">
          <div v-for="result in searchResults" :key="result.patient_id" @click="selectPatient(result)">
            <!-- 환자 선택 시 검색창 초기화 -->
            <VCard class="mt-1" id="autoSearch" @click="searchTerm=''">
              <VRow class="mb-0">
                <VCol cols="12" md="8">
                  <VCardText>ID: {{ result.patient_id }}</VCardText>
                </VCol>

                <VCol cols="12" md="3">
                  <VCardText>이름: {{ result.patient_name }}</VCardText>
                </VCol>

                <VCol cols="12" md="5">
                  <VCardText>주민등록번호: {{ result.patient_residence_number }}</VCardText>
                </VCol>

                <VCol>
                  <VCardText class="mt-0">전화번호: {{ result.patient_phone_number }}</VCardText>
                </VCol>
              </VRow>
            </VCard>
          </div>
        </div>
        <div class="search-condition ml-2 ">
          <VSelect label="검색 조건" v-model="searchCondition"
                   :items="['선택 안함','이름', '전화번호']" />
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
      <VCol cols="12">
        <VRow>
          <VCol cols="12" md="12">
            <VRow>
              <VCol cols="12" md="8">
                <VCardText>
                  이름 : {{ selectedPatient?.patient_name }} (환자ID : {{ selectedPatient?.patient_id }})
                </VCardText>
              </VCol>

              <VCol cols="12" md="4">
                <VCardText>
                  성별 : {{ selectedPatient?.patient_gender }}
                </VCardText>
              </VCol>

              <VCol cols="12" md="4">
                <VCardText>
                  생년월일 : {{ selectedPatient?.patient_birthday }}
                </VCardText>
              </VCol>

              <VCol cols="12" md="4">
                <VCardText>
                  주민등록번호 : {{ selectedPatient?.patient_residence_number }}
                </VCardText>
              </VCol>

              <VCol cols="12" md="4">
                <VCardText>
                  주소 : {{ selectedPatient?.patient_address }}
                </VCardText>
              </VCol>
            </VRow>
            <VRow>

              <VCol cols="12" md="4">
                <VCardText>
                  연락처 : {{ selectedPatient?.patient_phone_number }}
                </VCardText>
              </VCol>

              <VCol cols="12" md="4">
                <VCardText>
                  비상 연락처 : {{ selectedPatient?.patient_emergency_phone_number }}
                </VCardText>
              </VCol>
            </VRow>
          </VCol>
        </VRow>
        <VRow class="ml-3">
          <!--
          <VCol cols="12" md="4">
            <VCardText>
              약관 동의 여부 : {{ selectedPatient?.admitted ? '동의' : '비동의' }}
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
          </VCol>-->
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
            <!-- 미구현 상태
            <div v-for="record in selectedPatient?.record">
              {{ record }}
            </div>-->
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 방문 사유 -->
    <VCol cols="12" md="6">
      <VCard title="방문 사유" class="full-height">
        <VDivider/>
        <VCol>
          <div>
            <VTextarea label="방문 사유 기입"></VTextarea>
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
  block-size: 105%;
  inline-size: 110%;
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
