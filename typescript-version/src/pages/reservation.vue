<script setup lang="ts">
import Schedule from '@/exampleJson/Schedule.json'
import { Ref } from 'vue'
import PatientSearch from './PatientSearch.vue'
const token = sessionStorage.getItem('token')

// json 양식
interface Event {
  date: Date
  hour: number
  minute: number
  title: string
  diagnosis: string
}

interface Schedule {
  id: number
  name: string
  date: string
  hour: number
  minute: number
}

const selectedDate: Ref<string | null> = ref(null)
const isPatientSearchOpen = ref(false)
const events = inject<Ref<Event[]>>('events')

provide('selectedDate', selectedDate)
provide('isPatientSearchOpen', isPatientSearchOpen)

const openPatientSearch = () => {
  console.log('Selected Date :', selectedDate.value)
  isPatientSearchOpen.value = true
  console.log('open')
  console.log(isPatientSearchOpen.value)
}

const showEvent = (event: Event) => {
  console.log(event)
}

const clearSelectedDate = () => {
  selectedDate.value = null
}

let scheduleData: Ref<Schedule[] | null> = ref(null)

onMounted(async () => {
  scheduleData.value = Schedule.schedule
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

          <PatientSearch v-model="isPatientSearchOpen" />
        </VCard>

        <VBtn
          @click="openPatientSearch"
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
              {{ selectedDate ?? '전체' }} 예약 일정
            </VCardTitle>
          </VCardItem>

          <VDivider class="ml-2 mr-2" />

          <VCardText class="pt-2 table-container">
            <table class="list_table">
              <thead>
                <tr>
                  <th>환자ID</th>
                  <th>환자 이름</th>
                  <th>예약일자</th>
                  <th>예약시간</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in scheduleData"
                  :key="index"
                >
                  <template v-if="selectedDate === null || item.date === selectedDate">
                    <td>{{ item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.date }}</td>
                    <td>{{ item.hour }}시 {{ item.minute }}분</td>
                  </template>
                </tr>
              </tbody>
            </table>
          </VCardText>
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
