<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import { InBodyTest } from '@/pages/interfaces'
import { Chart, registerables } from 'chart.js'
import axios from 'axios'
import { IdStore } from '@/store'

const token = sessionStorage.getItem('token')
const store = IdStore()
// 백엔드에서 환자 정보 받아오기
let InBodyInformation = ref<InBodyTest[]>([])
const loadInBodyData = async () => {
  console.log('load inbody data')
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/inbody?patient=${store.id}`, {
      headers: { Authorization: `Token ${token}` },
    })
    InBodyInformation.value = response.data
    console.log(InBodyInformation.value)
  } catch (error) {
    console.log(error)
  }
}

export default defineComponent({
  data() {
    return {
      dialog: false,
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
    // 값들을 values 배열을 통해서 받기. 앞에서부터 weight라고 가정함
    const values = ref([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    // 인바디 데이터 추가하기
    const addData = async () => {
      try {
        const data = {
          weight: values.value[0],
          muscle_mass: values.value[1],
          body_fat_mass: values.value[2],
          bmi: values.value[3],
          percent_body_fat: values.value[4],
          right_arm: values.value[5],
          left_arm: values.value[6],
          trunk: values.value[7],
          right_leg: values.value[8],
          left_leg: values.value[9],
          patient: store.id,
          original_file_location: '',
        }
        console.log(data)
        const response = await axios.post(`http://yunsseong.uk:8000/api/inbody/`, data, {
          headers: { Authorization: `Token ${token}` },
        })
        location.reload()
      } catch (error) {
        console.error(error)
      }
    }

    watch(store, (newValue, oldValue) => {
      loadInBodyData()
      console.log('id가 바뀌었습니다!', store.id)
      console.log(InBodyInformation.value)
      resetChart()
    })

    // 차트 그림 만들기
    const chart1 = ref<HTMLCanvasElement | null>(null)
    const chart2 = ref<HTMLCanvasElement | null>(null)
    const chart3 = ref<HTMLCanvasElement | null>(null)

    const drawchart = () => {
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
                  data: [0, 0, 0], // 데이터 입력
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
                  data: [0, 0], // 데이터 입력
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
                  data: [0, 0, 0, 0, 0], // 데이터 입력
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
    }

    onMounted(() => {
      loadInBodyData()
      drawchart()
      console.log(store.id)
    })

    const resetChart = () => {
      // 차트 1 파괴하기
      const existingChart1 = chart1.value ? Chart.getChart(chart1.value) : null
      if (existingChart1) {
        existingChart1.destroy()
      }
      // 차트 2 파괴하기
      const existingChart2 = chart2.value ? Chart.getChart(chart2.value) : null
      if (existingChart2) {
        existingChart2.destroy()
      }
      // 차트 3 파괴하기
      const existingChart3 = chart3.value ? Chart.getChart(chart3.value) : null
      if (existingChart3) {
        existingChart3.destroy()
      }

      // 차트 다시그리기
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
                  data: [0, 0, 0], // 데이터 입력
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
                  data: [0, 0], // 데이터 입력
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
                  data: [0, 0, 0, 0, 0], // 데이터 입력
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
    }

    const updateChart = (index: number) => {
      console.log('그래프 업데이트!')

      // 차트 1 파괴하기
      const existingChart1 = chart1.value ? Chart.getChart(chart1.value) : null
      if (existingChart1) {
        existingChart1.destroy()
      }
      // 차트 2 파괴하기
      const existingChart2 = chart2.value ? Chart.getChart(chart2.value) : null
      if (existingChart2) {
        existingChart2.destroy()
      }
      // 차트 3 파괴하기
      const existingChart3 = chart3.value ? Chart.getChart(chart3.value) : null
      if (existingChart3) {
        existingChart3.destroy()
      }

      // 차트 다시그리기
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
                  data: [
                    InBodyInformation.value[index].weight,
                    InBodyInformation.value[index].muscle_mass,
                    InBodyInformation.value[index].body_fat_mass,
                  ], // 데이터 입력
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
                  data: [InBodyInformation.value[index].bmi, InBodyInformation.value[index].percent_body_fat], // 데이터 입력
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
                  data: [
                    InBodyInformation.value[index].right_arm,
                    InBodyInformation.value[index].left_arm,
                    InBodyInformation.value[index].trunk,
                    InBodyInformation.value[index].right_leg,
                    InBodyInformation.value[index].left_leg,
                  ], // 데이터 입력
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
    }

    return {
      chart1,
      chart2,
      chart3,
      InBodyInformation,
      updateChart,
      addData,
      values,
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
            v-model="values[0]"
            label="체중"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="values[1]"
            label="근육량"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="values[2]"
            label="체지방량"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="values[3]"
            label="BMI"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="values[4]"
            label="체지방률"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="values[5]"
            label="오른팔"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="values[6]"
            label="왼팔"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="values[7]"
            label="몸통"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="values[8]"
            label="오른다리"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="values[9]"
            label="왼다리"
            type="number"
            class="text-field"
          ></VTextField>
        </VCardContent>
        <VCardActions>
          <VBtn
            @click="
              () => {
                addData()
                saveRecord()
              }
            "
            >저장</VBtn
          >
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
          v-for="(item, index) in InBodyInformation"
          :key="index"
          style="margin: 5px"
          @click="updateChart(index)"
        >
          {{ item.record_date.slice(0, 10) }}</VBtn
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
