<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { BloodTest } from "@/pages/interfaces";
import { Chart, registerables } from 'chart.js'
import axios from 'axios'

// 혈액검사기록을 저장할 리스트 생성 -> 변경 가능해야함
let BloodTestRecord = ref<BloodTest[]>([])

// 오류나지 않게 임시로 url 넣어놨음. 혈액검사에 맞는 url로 고쳐줘야함
onMounted(async () => {
  try {
    const response = await axios.get('http;//yunsseong.uk:8000/api/patients/') // 수정 필요
    const BloodTestRecord = response.data // 가져온 데이터를 어떻게 가공하여 사용할지 정의 필요
    console.log('Blood test record loading success')
  } catch (error) {
    console.error(error)
  }
})

export default defineComponent({
  data() {
    return {
      dialog: false,
      hemoglobin: 0,
      fasting_blood_sugar: 0,
      total_cholesterol: 0,
      hdl_cholesterol: 0,
      triglycerides: 0,
      ldl_cholesterol: 0,
      serum_creatinine: 0,
      glomerular_filtration_rate: 0,
      ast: 0,
      alt: 0,
      gamma_gt: 0,
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
    const anemia_chart = ref<HTMLCanvasElement | null>(null)
    const diabetes_chart = ref<HTMLCanvasElement | null>(null)
    const lipidemia_chart = ref<HTMLCanvasElement | null>(null)
    const kidney_chart = ref<HTMLCanvasElement | null>(null)
    const liver_chart = ref<HTMLCanvasElement | null>(null)

    onMounted(() => {
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
                  data: [10], // 데이터 입력
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
                  data: [84], // 데이터 입력
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
                  data: [150, 72, 41, 69], // 데이터 입력
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
                  data: [10, 111], // 데이터 입력
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
                  data: [39, 23, 24], // 데이터 입력
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
    })

    return {
      anemia_chart,
      diabetes_chart,
      lipidemia_chart,
      kidney_chart,
      liver_chart,
    }
  },
})
</script>

<template>
  <div class="title-container">
    <h2 style="margin-left: 10px; margin-bottom: 10px">Blood Test Result</h2>
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
            v-model="hemoglobin"
            label="혈색소"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="fasting_blood_sugar"
            label="공복혈당"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="total_cholesterol"
            label="총 콜레스테롤"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="hdl_cholesterol"
            label="HDL-콜레스테롤"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="triglycerides"
            label="중성지방"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="ldl_cholesterol"
            label="LDL-콜레스테롤"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="serum_creatinine"
            label="혈청크레아티닌"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="glomerular_filtration_rate"
            label="신사구체여과율"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="ast"
            label="AST"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="alt"
            label="ALT"
            type="number"
            class="text-field"
          ></VTextField>
          <VTextField
            v-model="gamma_gt"
            label="감마지티피"
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
        <h3>혈액검사 기록</h3>
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
  padding-top: 10px;
  padding-bottom: 10px;
}
.numeric-container {
  text-align: center;
}
.divider {
  border-bottom: 1px solid #000;
}
.table-container {
  width: 100%;
}
.table-content {
  padding: 20px;
}
.title-container {
  display: grid;
  grid-template-columns: 11fr 1fr;
}
.dialog-content {
  padding-top: 10px;
  padding-bottom: 10px;
}
.text-field {
  margin: 10px;
}
</style>
