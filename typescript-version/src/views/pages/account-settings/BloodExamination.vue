<script lang="ts">
import { BloodTest } from '@/pages/interfaces'
import axios from 'axios'
import { Chart, registerables } from 'chart.js'
import { IdStore } from '@/store'
import { ref, onMounted, watch } from 'vue'

// 백엔드에서 환자 정보 받아오기
const token = sessionStorage.getItem('token')
const store = IdStore()
let BloodInformation = ref<BloodTest[]>([])
const loadBloodData = async () => {
  console.log('load inbody data')
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/blood?patient=${store.id}`, {
      headers: { Authorization: `Token ${token}` },
    })
    BloodInformation.value = response.data
    console.log(BloodInformation.value[0].hemoglobin)
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
      console.log('closeDialog 호출!')
    },
    saveRecord() {
      // 여기서 수치를 어떻게 저장할지 구현해야함
      this.dialog = false // 저장 후 모달 닫기
      console.log('saveRecord 호출!')
    },
  },
  setup() {
    // 값들을 values 배열을 통해서 받기. 앞에서부터 weight라고 가정함
    const values = ref([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const fakes = ref([])
    // 인바디 데이터 추가하기
    const addData = async () => {
      fakes.value = []
      console.log('addData가 호출되었음! 자동으로 갱신되나 볼 것!')
      try {
        const data = {
          hemoglobin: values.value[0],
          fasting_blood_sugar: values.value[1],
          total_cholesterol: values.value[2],
          hdl_cholesterol: values.value[3],
          triglycerides: values.value[4],
          ldl_cholesterol: values.value[5],
          serum_creatinine: values.value[6],
          glomerular_filtration_rate: values.value[7],
          ast: values.value[8],
          alt: values.value[9],
          gamma_gt: values.value[10],
          patient: store.id,
        }
        console.log(data)
        const response = await axios.post(`http://yunsseong.uk:8000/api/blood/`, data, {
          headers: { Authorization: `Token ${token}` },
        })
      } catch (error) {
        console.error(error)
      }
    }

    watch(store, (newValue, oldValue) => {
      loadBloodData()
      console.log('id가 바뀌었습니다!', store.id)
      console.log(BloodInformation.value)
      resetChart()
    })

    const anemia_chart = ref<HTMLCanvasElement | null>(null)
    const diabetes_chart = ref<HTMLCanvasElement | null>(null)
    const lipidemia_chart = ref<HTMLCanvasElement | null>(null)
    const kidney_chart = ref<HTMLCanvasElement | null>(null)
    const liver_chart = ref<HTMLCanvasElement | null>(null)

    const resetChart = () => {
      // 차트 1 파괴하기
      const existingChart1 = anemia_chart.value ? Chart.getChart(anemia_chart.value) : null
      if (existingChart1) {
        existingChart1.destroy()
      }
      // 차트 2 파괴하기
      const existingChart2 = diabetes_chart.value ? Chart.getChart(diabetes_chart.value) : null
      if (existingChart2) {
        existingChart2.destroy()
      }
      // 차트 3 파괴하기
      const existingChart3 = lipidemia_chart.value ? Chart.getChart(lipidemia_chart.value) : null
      if (existingChart3) {
        existingChart3.destroy()
      }
      // 차트 4 파괴하기
      const existingChart4 = kidney_chart.value ? Chart.getChart(kidney_chart.value) : null
      if (existingChart4) {
        existingChart4.destroy()
      }
      // 차트 5 파괴하기
      const existingChart5 = liver_chart.value ? Chart.getChart(liver_chart.value) : null
      if (existingChart5) {
        existingChart5.destroy()
      }
      if (anemia_chart.value) {
        const ctx = anemia_chart.value.getContext('2d')
        if (ctx) {
          Chart.register(...registerables)

          new Chart(ctx, {
            type: 'bar', // 막대 그래프
            data: {
              labels: ['혈색소'],
              datasets: [
                {
                  label: '(g/dl)',
                  data: [0], // 데이터 입력
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
                  max: 20,
                },
                y: {
                  beginAtZero: true,
                },
              },
            },
          })
        }
      }
      if (diabetes_chart.value) {
        const ctx = diabetes_chart.value.getContext('2d')
        if (ctx) {
          Chart.register(...registerables)

          new Chart(ctx, {
            type: 'bar', // 막대 그래프
            data: {
              labels: ['공복혈당'],
              datasets: [
                {
                  label: '(mg/dl)',
                  data: [0], // 데이터 입력
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

      if (lipidemia_chart.value) {
        const ctx = lipidemia_chart.value.getContext('2d')
        if (ctx) {
          Chart.register(...registerables)

          new Chart(ctx, {
            type: 'bar', // 막대 그래프
            data: {
              labels: ['총콜레스테롤', 'HDL-콜레스테롤', '중성지방', 'LDL-콜레스테롤'],
              datasets: [
                {
                  label: '(mg/dl)',
                  data: [0, 0, 0, 0], // 데이터 입력
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
                  max: 250,
                },
                y: {
                  beginAtZero: true,
                },
              },
            },
          })
        }
      }

      if (kidney_chart.value) {
        const ctx = kidney_chart.value.getContext('2d')
        if (ctx) {
          Chart.register(...registerables)

          new Chart(ctx, {
            type: 'bar', // 막대 그래프
            data: {
              labels: ['혈청크레아티닌', '신사구체여과율(e-GFR)'],
              datasets: [
                {
                  label: '(mg/dl)',
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
                  max: 160,
                },
                y: {
                  beginAtZero: true,
                },
              },
            },
          })
        }
      }

      if (liver_chart.value) {
        const ctx = liver_chart.value.getContext('2d')
        if (ctx) {
          Chart.register(...registerables)

          new Chart(ctx, {
            type: 'bar', // 막대 그래프
            data: {
              labels: ['AST(SGOT)', 'ALT(SGPT)', '감마지티피(v-GTP)'],
              datasets: [
                {
                  label: '(U/L)',
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
                  max: 200,
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

    const drawChart = () => {
      if (anemia_chart.value) {
        const ctx = anemia_chart.value.getContext('2d')
        if (ctx) {
          Chart.register(...registerables)

          new Chart(ctx, {
            type: 'bar', // 막대 그래프
            data: {
              labels: ['혈색소'],
              datasets: [
                {
                  label: '(g/dl)',
                  data: [0], // 데이터 입력
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
                  max: 20,
                },
                y: {
                  beginAtZero: true,
                },
              },
            },
          })
        }
      }
      if (diabetes_chart.value) {
        const ctx = diabetes_chart.value.getContext('2d')
        if (ctx) {
          Chart.register(...registerables)

          new Chart(ctx, {
            type: 'bar', // 막대 그래프
            data: {
              labels: ['공복혈당'],
              datasets: [
                {
                  label: '(mg/dl)',
                  data: [0], // 데이터 입력
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

      if (lipidemia_chart.value) {
        const ctx = lipidemia_chart.value.getContext('2d')
        if (ctx) {
          Chart.register(...registerables)

          new Chart(ctx, {
            type: 'bar', // 막대 그래프
            data: {
              labels: ['총콜레스테롤', 'HDL-콜레스테롤', '중성지방', 'LDL-콜레스테롤'],
              datasets: [
                {
                  label: '(mg/dl)',
                  data: [0, 0, 0, 0], // 데이터 입력
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
                  max: 250,
                },
                y: {
                  beginAtZero: true,
                },
              },
            },
          })
        }
      }

      if (kidney_chart.value) {
        const ctx = kidney_chart.value.getContext('2d')
        if (ctx) {
          Chart.register(...registerables)

          new Chart(ctx, {
            type: 'bar', // 막대 그래프
            data: {
              labels: ['혈청크레아티닌', '신사구체여과율(e-GFR)'],
              datasets: [
                {
                  label: '(mg/dl)',
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
                  max: 160,
                },
                y: {
                  beginAtZero: true,
                },
              },
            },
          })
        }
      }

      if (liver_chart.value) {
        const ctx = liver_chart.value.getContext('2d')
        if (ctx) {
          Chart.register(...registerables)

          new Chart(ctx, {
            type: 'bar', // 막대 그래프
            data: {
              labels: ['AST(SGOT)', 'ALT(SGPT)', '감마지티피(v-GTP)'],
              datasets: [
                {
                  label: '(U/L)',
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
                  max: 200,
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
      drawChart()
      loadBloodData()
    })

    const updateChart = (index: number) => {
      console.log('그래프 업데이트!')

      // 차트 1 파괴하기
      const existingChart1 = anemia_chart.value ? Chart.getChart(anemia_chart.value) : null
      if (existingChart1) {
        existingChart1.destroy()
      }
      // 차트 2 파괴하기
      const existingChart2 = diabetes_chart.value ? Chart.getChart(diabetes_chart.value) : null
      if (existingChart2) {
        existingChart2.destroy()
      }
      // 차트 3 파괴하기
      const existingChart3 = lipidemia_chart.value ? Chart.getChart(lipidemia_chart.value) : null
      if (existingChart3) {
        existingChart3.destroy()
      }
      // 차트 4 파괴하기
      const existingChart4 = kidney_chart.value ? Chart.getChart(kidney_chart.value) : null
      if (existingChart4) {
        existingChart4.destroy()
      }
      // 차트 5 파괴하기
      const existingChart5 = liver_chart.value ? Chart.getChart(liver_chart.value) : null
      if (existingChart5) {
        existingChart5.destroy()
      }

      if (anemia_chart.value) {
        const ctx = anemia_chart.value.getContext('2d')
        if (ctx) {
          Chart.register(...registerables)

          new Chart(ctx, {
            type: 'bar', // 막대 그래프
            data: {
              labels: ['혈색소'],
              datasets: [
                {
                  label: '(g/dl)',
                  data: [BloodInformation.value[index].hemoglobin], // 데이터 입력
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
                  max: 20,
                },
                y: {
                  beginAtZero: true,
                },
              },
            },
          })
        }
      }
      if (diabetes_chart.value) {
        const ctx = diabetes_chart.value.getContext('2d')
        if (ctx) {
          Chart.register(...registerables)

          new Chart(ctx, {
            type: 'bar', // 막대 그래프
            data: {
              labels: ['공복혈당'],
              datasets: [
                {
                  label: '(mg/dl)',
                  data: [BloodInformation.value[index].fasting_blood_sugar], // 데이터 입력
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

      if (lipidemia_chart.value) {
        const ctx = lipidemia_chart.value.getContext('2d')
        if (ctx) {
          Chart.register(...registerables)

          new Chart(ctx, {
            type: 'bar', // 막대 그래프
            data: {
              labels: ['총콜레스테롤', 'HDL-콜레스테롤', '중성지방', 'LDL-콜레스테롤'],
              datasets: [
                {
                  label: '(mg/dl)',
                  data: [
                    BloodInformation.value[index].total_cholesterol,
                    BloodInformation.value[index].hdl_cholesterol,
                    BloodInformation.value[index].triglycerides,
                    BloodInformation.value[index].ldl_cholesterol,
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
                  max: 250,
                },
                y: {
                  beginAtZero: true,
                },
              },
            },
          })
        }
      }

      if (kidney_chart.value) {
        const ctx = kidney_chart.value.getContext('2d')
        if (ctx) {
          Chart.register(...registerables)

          new Chart(ctx, {
            type: 'bar', // 막대 그래프
            data: {
              labels: ['혈청크레아티닌', '신사구체여과율(e-GFR)'],
              datasets: [
                {
                  label: '(mg/dl)',
                  data: [
                    BloodInformation.value[index].serum_creatinine,
                    BloodInformation.value[index].glomerular_filtration_rate,
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
                  max: 160,
                },
                y: {
                  beginAtZero: true,
                },
              },
            },
          })
        }
      }

      if (liver_chart.value) {
        const ctx = liver_chart.value.getContext('2d')
        if (ctx) {
          Chart.register(...registerables)

          new Chart(ctx, {
            type: 'bar', // 막대 그래프
            data: {
              labels: ['AST(SGOT)', 'ALT(SGPT)', '감마지티피(v-GTP)'],
              datasets: [
                {
                  label: '(U/L)',
                  data: [
                    BloodInformation.value[index].ast,
                    BloodInformation.value[index].alt,
                    BloodInformation.value[index].gamma_gt,
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
                  max: 200,
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
      anemia_chart,
      diabetes_chart,
      lipidemia_chart,
      kidney_chart,
      liver_chart,
      BloodInformation,
      updateChart,
      values,
      addData,
      loadBloodData,
    }
  },
})
</script>

<template>
  <div class="title-container">
    <h2 style="margin-bottom: 10px; margin-left: 10px">Blood Test Result</h2>
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
      <VCard class="dialog-content">
        <VCardTitle>혈액검사 측정값 입력</VCardTitle>
        <VCardContent>
          <VTextField
            v-model="values[0]"
            label="혈색소"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="values[1]"
            label="공복혈당"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="values[2]"
            label="총 콜레스테롤"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="values[3]"
            label="HDL-콜레스테롤"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="values[4]"
            label="중성지방"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="values[5]"
            label="LDL-콜레스테롤"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="values[6]"
            label="혈청크레아티닌"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="values[7]"
            label="신사구체여과율"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="values[8]"
            label="AST"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="values[9]"
            label="ALT"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="values[10]"
            label="감마지티피"
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
                loadBloodData()
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
        <h3>혈액검사 기록</h3>
        <div style="text-align: center">
          <VBtn
            v-for="(item, index) in BloodInformation"
            :key="index"
            style="margin: 5px"
            @click="updateChart(index)"
          >
            {{ item.record_date.slice(0, 10) }}
          </VBtn>
        </div>
      </VCard>
    </VCol>
    <VCol cols="10">
      <VCard class="container"
        ><table
          border="1"
          class="table-container"
        >
          <tr class="table-content">
            <th>빈혈</th>
            <td>
              <canvas
                ref="anemia_chart"
                height="45"
              ></canvas>
            </td>
          </tr>
          <tr>
            <th>당뇨병</th>
            <td>
              <canvas
                ref="diabetes_chart"
                height="45"
              ></canvas>
            </td>
          </tr>
          <tr class="table-content">
            <th>이상지질혈증</th>
            <td>
              <canvas
                ref="lipidemia_chart"
                height="120"
              ></canvas>
            </td>
          </tr>
          <tr>
            <th>신장질환</th>
            <td>
              <canvas
                ref="kidney_chart"
                height="70"
              ></canvas>
            </td>
          </tr>
          <tr class="table-content">
            <th>간장질환</th>
            <td>
              <canvas
                ref="liver_chart"
                height="100"
              ></canvas>
            </td>
          </tr>
        </table>
      </VCard>
    </VCol>
  </VRow>
</template>
<style lang='scss'>
.container {
  padding-block: 10px;
}

.numeric-container {
  text-align: center;
}

.divider {
  border-block-end: 1px solid #000;
}

.table-container {
  inline-size: 100%;
}

.table-content {
  padding: 20px;
}

.title-container {
  display: grid;
  grid-template-columns: 11fr 1fr;
}

.dialog-content {
  padding-block: 10px;
}

.text-field {
  margin: 10px;
}
</style>
