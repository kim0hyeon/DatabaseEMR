<script setup lang="ts">
import { Reservation } from '@/pages/interfaces'
import PatientSearch from './PatientSearch.vue'
import axios from "axios";
const token = sessionStorage.getItem('token')

let selectedDate = ref('')
const isPatientSearchOpen = ref(false)

const openPatientSearch = (date: string) => {
  selectedDate.value = date
  isPatientSearchOpen.value = true
}

const clearSelectedDate = () => {
  selectedDate.value = ''
}

let reservationData = ref<Reservation[]>([])

onMounted(async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/reservation`,{
      headers: { Authorization: `Token ${token}` },
    })
    reservationData.value = response.data
  } catch (error) {
    console.error(error)
  }
})

watch(isPatientSearchOpen, (newVal) => {
  if (newVal === false) {
    location.reload()
  }
})

// 검사 검색 로직
const searchTerm: Ref<string> = ref('')
const searchResults = reactive<Reservation[]>([])

const searchReservation = (event: Event) => {
  searchTerm.value = (event.target as HTMLInputElement).value
  if (searchTerm.value) {
    searchResults.splice(
      0,
      searchResults.length,
      ...reservationData.value.filter(reservation => reservation?.patient.patient_name.includes(searchTerm.value)),
    )
    console.log('after:', searchResults)
  } else {
    searchResults.splice(0, searchResults.length)
  }
}

const filterByDateAndSearchTerm = computed(() => {
  let items = searchTerm.value !== '' ? searchResults : reservationData.value
  if (selectedDate.value) {
    items = items.filter(item => item.date === selectedDate.value)
  }
  return items
})
</script>

<template>
  <div class="pa-5">
    <VRow>
      <VCol
        cols="12"
        md="4"
        class="mb-4"
      >
        <VCard height="300">
          <v-calendar
            class="cal"
            :value="selectedDate"
            @dayclick="(date : Date) => selectedDate = date.id"
          />
        </VCard>

        <PatientSearch v-model="isPatientSearchOpen" :date="selectedDate"/>
        <VBtn
          @click="openPatientSearch(selectedDate)"
          class="mr-3 reservationBtn"
          >예약 일정 추가</VBtn
        >
        <VBtn
          @click="clearSelectedDate"
          class="clearBtn"
          >날짜 초기화</VBtn
        >
      </VCol>

      <VCol class="user-list-container">
        <VCard class="user_list scroll-container1">
          <VCardItem class="justify-center">
            <VCardTitle class="font-weight-semibold text-2xl text-uppercase">
              {{ selectedDate !== '' ? selectedDate : '전체' }} 예약 일정
            </VCardTitle>
          </VCardItem>

          <VDivider class="ml-2 mr-2" />

          <VTextField
            @input="searchReservation"
            label="예약 일정 검색"
            class="mr-10 ml-10 mt-6 mb-6"
          />

          <v-data-table
            :headers="[
                { title: '환자 이름', align: 'center', value: 'patient.patient_name' },
                { title: '예약 일자', align: 'center', value: 'date' },
                { title: '예약 시간', align: 'center', value: `hour` },
              ]"
            :items="filterByDateAndSearchTerm"
            :items-per-page="5"
          >
            <template v-slot:item.hour="{ item }">
              {{ item.hour }}시 {{ item.minute }}분
            </template>
          </v-data-table>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss">
@use '@core/scss/pages/page-auth.scss';

.cal {
  block-size: 100%;
  inline-size: 100%;
}

.user-list-container {
  block-size: 700px;
}

.list_table {
  border-collapse: separate; /* 셀 경계를 분리합니다. */
  border-spacing: 10px; /* 원하는 간격으로 설정합니다. */
  color: black;
  inline-size: 100%;
}

/* 예시 스타일 */
.list_table th,
.list_table td {
  padding: 10px; /* 셀 안의 내용과 경계 사이의 여백을 조절합니다. */
  text-align: center;
}

.list_table th {
  font-size: 15px;
}

.reservationBtn,
.clearBtn {
  inline-size: 100%;
  margin-block-start: 10px;
}

.scroll-container1 {
  padding: 10px; /* 패딩 설정 */
  border: 1px solid #ccc; /* 경계선 스타일 */
  block-size: 100%;
  overflow-y: auto; /* 높이를 초과하면 y축 스크롤 바 표시 */
}
</style>
