<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import axios from 'axios'
import { IdStore } from '@/store'
const store = IdStore()

// 인바디 테스트 기록 정보 받아오기 (속성들은 이름 정하면 그때 넣기)
interface InBodyTest {
  weight: number
  muscle_mass: number
  body_fat_mass: number
  bmi: number
  percent_body_fat: number
  right_arm: number
  left_arm: number
  trunk: number
  right_leg: number
  left_leg: number
  patient_id: string
  record_date: string
  inbody_id: string
}
// 인바디기록을 저장할 리스트 생성 -> 변경 가능해야함
let InBodyTestRecord = ref<InBodyTest[]>([])

onMounted(async () => {})

export default defineComponent({
  data() {
    return {
      dialog: false,
      weight: 0,
      muscle_mass: 0,
      body_fat_mass: 0,
      bmi: 0,
      percent_body_fat: 0,
      right_arm: 0,
      left_arm: 0,
      trunk: 0,
      right_leg: 0,
      left_leg: 0,
    }
  },
  methods: {
    clickInbodyRecord() {
      console.log('잘 클릭되었음!!')
    },
    openDialog() {
      this.dialog = true
      console.log('토글버튼클릭!')
    },
    closeDialog() {
      this.dialog = false
    },
    saveRecord() {
      // 여기서 수치를 어떻게 저장할지 구현해야함

      this.dialog = false // 저장 후 모달 닫기
    },
  },
  setup() {
    // 인바디 기록 확인하기

    // 차트 그림 만들기
    const chart1 = ref<HTMLCanvasElement | null>(null)
    const chart2 = ref<HTMLCanvasElement | null>(null)
    const chart3 = ref<HTMLCanvasElement | null>(null)

    onMounted(async () => {
      try {
        const response = await axios.get('http://yunsseong.uk:8000/api/inbody/') // 데이터 가져오기
        InBodyTestRecord = response.data // 가져온 데이터를 어떻게 가공하여 사용할지 정의 필요
        console.log('inbody test record loading success')
        console.log(InBodyTestRecord)
      } catch (error) {
        console.error(error)
      }
      if (chart1.value) {
        const ctx = chart1.value.getContext('2d')
        if (ctx) {
          Chart.register(...registerables)

          new Chart(ctx, {
            type: 'bar', // 막대 그래프
            data: {
              labels: ['체중', '골격근량', '체지방량'],
              datasets: [
                {
                  label: '골격근-지방',
                  data: [82.8, 34.9, 21.0], // 데이터 입력
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                },
              ],
            },
            options: {
              indexAxis: 'y', // 가로로 출력되도록 설정
              responsive: true,
              scales: {
                x: {
                  beginAtZero: true,
                  min: 0,
                  max: 150,
                },
                y: {
                  beginAtZero: true,
                },
              },
            },
          })
        }
      }
      if (chart2.value) {
        const ctx = chart2.value.getContext('2d')
        if (ctx) {
          Chart.register(...registerables)

          new Chart(ctx, {
            type: 'bar', // 막대 그래프
            data: {
              labels: ['BMI', '체지방률'],
              datasets: [
                {
                  label: '비만진단',
                  data: [25, 25.4], // 데이터 입력
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                },
              ],
            },
            options: {
              indexAxis: 'y', // 가로로 출력되도록 설정
              responsive: true,
              scales: {
                x: {
                  beginAtZero: true,
                  min: 0,
                  max: 50,
                },
                y: {
                  beginAtZero: true,
                },
              },
            },
          })
        }
      }

      if (chart3.value) {
        const ctx = chart3.value.getContext('2d')
        if (ctx) {
          Chart.register(...registerables)

          new Chart(ctx, {
            type: 'bar', // 막대 그래프
            data: {
              labels: ['오른팔', '왼팔', '몸통', '오른다리', '왼다리'],
              datasets: [
                {
                  label: '신체균형',
                  data: [3.25, 3.32, 26.6, 10.09, 9.9], // 데이터 입력
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                },
              ],
            },
            options: {
              indexAxis: 'y', // 가로로 출력되도록 설정
              responsive: true,
              scales: {
                x: {
                  beginAtZero: true,
                  min: 0,
                  max: 50,
                },
                y: {
                  beginAtZero: true,
                },
              },
            },
          })
        }
      }
    })

    return {
      chart1,
      chart2,
      chart3,
    }
  },
})
</script>

<template>
  <!-- 인바디 기록날짜, 인바디 그래프 출력 -->
  <div class="title-container">
    <h2 style="margin-left: 10px; margin-bottom: 10px">InBody Result</h2>
    <!-- 인바디 기록 추가 -->
    <VDialog
      v-model="dialog"
      max-width="500"
    >
      <template v-slot:activator="{ on }">
        <VBtn
          v-on="on"
          @click="openDialog"
          >기록 추가</VBtn
        >
      </template>
      <VCard>
        <VCardTitle>인바디 측정값 입력</VCardTitle>
        <VCardContent class="dialog-content">
          <VTextField
            v-model="weight"
            label="체중"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="muscle_mass"
            label="근육량"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="body_fat_mass"
            label="체지방량"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="bmi"
            label="BMI"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="percent_body_fat"
            label="체지방률"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="right_arm"
            label="오른팔"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="left_arm"
            label="왼팔"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="trunk"
            label="몸통"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="right_leg"
            label="오른다리"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="left_leg"
            label="왼다리"
            type="number"
            class="text-field"
          ></VTextField>
        </VCardContent>
        <VCardActions>
          <VBtn @click="saveRecord">저장</VBtn>
          <VBtn @click="closeDialog">나가기</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
  <div style="margin-top: 10px; margin-bottom: 10px"></div>
  <VRow>
    <VCol cols="2">
      <VCard class="inbody-record">
        <h3>인바디 기록</h3>
        <VBtn
          @click="clickInbodyRecord"
          class="date-button"
          >2023-12-12</VBtn
        >
        <VBtn
          @click="clickInbodyRecord"
          class="date-button"
          >2023-12-11</VBtn
        >
        <VBtn
          @click="clickInbodyRecord"
          class="date-button"
          >2023-12-10</VBtn
        >
      </VCard>
    </VCol>
    <VCol cols="10">
      <VCard class="container"
        ><table
          border="1"
          class="table-container"
        >
          <tr class="table-content">
            <td style="width: 90%">
              <canvas
                ref="chart1"
                height="60"
              ></canvas>
            </td>
            <td class="standard-range">
              <h4>표준점수</h4>
              <div class="standard-score">62.0 - 83.8</div>
              <div class="standard-score">31.3 - 38.3</div>
              <div class="standard-score">8.8 - 17.5</div>
            </td>
          </tr>
          <tr>
            <td>
              <canvas
                ref="chart2"
                height="60"
              ></canvas>
            </td>
            <td class="standard-range">
              <h4>표준점수</h4>
              <div class="standard-score">18.5 - 23.0</div>
              <div class="standard-score">10.0 - 20.0</div>
            </td>
          </tr>
          <tr class="table-content">
            <td>
              <canvas
                ref="chart3"
                height="120"
              ></canvas>
            </td>
            <td class="standard-range">
              <h4>표준점수</h4>
              <div class="standard-score">85 - 115</div>
              <div class="standard-score">85 - 115</div>
              <div class="standard-score">90 - 110</div>
              <div class="standard-score">90 - 110</div>
              <div class="standard-score">90 - 110</div>
            </td>
          </tr>
        </table>
      </VCard>
    </VCol>
  </VRow>
</template>
<style lang='scss'>
.container {
  padding: 10px;
}
.numeric-container {
  text-align: center;
}
.divider {
  border-bottom: 1px solid #000;
}
.table-container {
  width: 80%;
}
.table-content {
  padding: 20px;
}
.standard-range {
  text-align: center;
  font-size: 10px;
}
.inbody-record {
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
}
.title-container {
  display: grid;
  grid-template-columns: 11fr 1fr;
}
.date-button {
  margin-top: 10px;
  margin-bottom: 10px;
}
.text-field {
  margin: 10px;
}
</style>