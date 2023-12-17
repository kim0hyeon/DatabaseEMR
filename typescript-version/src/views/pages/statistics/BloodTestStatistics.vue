<script lang='ts'>
import axios from 'axios'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import { IdStore } from '@/store'

interface BloodTest {
  hemoglobin: number
  fasting_blood_sugar: number
  total_cholesterol: number
  hdl_cholesterol: number
  triglycerides: number
  ldl_cholesterol: number
  serum_creatinine: number
  glomerular_filtration_rate: number
  ast: number
  alt: number
  gamma_gt: number
  record_date: string
  patient_id: string
  blood_id: string
}

const BloodTests: BloodTest[] = [
  {
    hemoglobin: 14,
    fasting_blood_sugar: 90,
    total_cholesterol: 180,
    hdl_cholesterol: 50,
    triglycerides: 120,
    ldl_cholesterol: 100,
    serum_creatinine: 0.8,
    glomerular_filtration_rate: 90,
    ast: 25,
    alt: 30,
    gamma_gt: 20,
    record_date: '2023-12-04',
    patient_id: '12312',
    blood_id: '123123',
  },
  {
    hemoglobin: 13.5,
    fasting_blood_sugar: 95,
    total_cholesterol: 190,
    hdl_cholesterol: 48,
    triglycerides: 110,
    ldl_cholesterol: 95,
    serum_creatinine: 0.9,
    glomerular_filtration_rate: 85,
    ast: 30,
    alt: 35,
    gamma_gt: 22,
    record_date: '2023-12-06',
    patient_id: '12312',
    blood_id: '123123',
  },
  {
    hemoglobin: 15,
    fasting_blood_sugar: 88,
    total_cholesterol: 175,
    hdl_cholesterol: 52,
    triglycerides: 100,
    ldl_cholesterol: 92,
    serum_creatinine: 0.85,
    glomerular_filtration_rate: 92,
    ast: 28,
    alt: 32,
    gamma_gt: 18,
    record_date: '2023-12-08',
    patient_id: '12312',
    blood_id: '123123',
  },
  {
    hemoglobin: 14.2,
    fasting_blood_sugar: 92,
    total_cholesterol: 185,
    hdl_cholesterol: 49,
    triglycerides: 115,
    ldl_cholesterol: 98,
    serum_creatinine: 0.88,
    glomerular_filtration_rate: 88,
    ast: 32,
    alt: 38,
    gamma_gt: 24,
    record_date: '2023-12-10',
    patient_id: '12312',
    blood_id: '123123',
  },
  {
    hemoglobin: 14.5,
    fasting_blood_sugar: 89,
    total_cholesterol: 170,
    hdl_cholesterol: 55,
    triglycerides: 105,
    ldl_cholesterol: 90,
    serum_creatinine: 0.82,
    glomerular_filtration_rate: 91,
    ast: 27,
    alt: 34,
    gamma_gt: 21,
    record_date: '2023-12-12',
    patient_id: '12312',
    blood_id: '123123',
  },
]

// 백엔드에서 환자 정보 받아오기
const token = sessionStorage.getItem('token')
const store = IdStore()
let BloodInformation = ref<BloodTest[]>([])
const loadBloodData = async () => {
  console.log('load blood data')
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/blood?patient=${store.id}`, {
      headers: { Authorization: `Token ${token}` },
    })
    BloodInformation.value = response.data
    console.log(BloodInformation.value[0])
  } catch (error) {
    console.log(error)
  }
}

// 차트 그래프 만들기
export default {
  setup() {
    const chart = ref<HTMLCanvasElement | null>(null)
    // 체크되었는지 안되었는지 확인하는 변수들
    const CheckHemo = ref(false)
    const CheckFBS = ref(false)
    const CheckTC = ref(false)
    const CheckHDL = ref(false)
    const CheckTri = ref(false)
    const CheckLDL = ref(false)
    const CheckSC = ref(false)
    const CheckGFR = ref(false)
    const CheckAST = ref(false)
    const CheckALT = ref(false)
    const CheckGG = ref(false)

    // patient.id가 바뀌었을 경우 실행할 로직
    watch(store, (newValue, oldValue) => {
      loadBloodData()
      console.log('patient.id값이 변경되었습니다.')
    })

    // 다른 환자를 선택했을 때 실행할 함수 2개
    const runMethods = () => {
      loadBloodData()
      updateChart()
    }

    // 그래프를 그리는 함수
    const drawChart = () => {
      if (chart.value) {
        const ctx = chart.value.getContext('2d')

        if (ctx) {
          new Chart(ctx, {
            type: 'line',
            data: {
              labels: [
                BloodTests[0].record_date,
                BloodTests[1].record_date,
                BloodTests[2].record_date,
                BloodTests[3].record_date,
                BloodTests[4].record_date,
              ],
              datasets: [
                {
                  label: '예시 1',
                  borderColor: 'rgb(75, 192, 192)',
                  data: [0, 10, 5, 2, 20],
                },
                {
                  label: '예시 2',
                  borderColor: 'rgb(255, 99, 132)',
                  data: [5, 15, 10, 7, 25],
                },
                {
                  label: '예시 3',
                  borderColor: 'rgb(79, 99, 132)',
                  data: [20, 8, 13, 9, 20],
                },
              ],
            },
          })
        }
      }
    }

    onMounted(() => {
      loadBloodData()
      drawChart()
    })

    // 그래프를 업데이트하는 함수
    const updateChart = () => {
      console.log('그래프 업데이트!')
      const dataset = []
      if (CheckHemo.value === true) {
        const datas = {
          label: '혈색소',
          borderColor: 'rgb(75, 192, 192)',
          data: [
            BloodInformation.value[0].hemoglobin,
            BloodInformation.value[1].hemoglobin,
            BloodInformation.value[2].hemoglobin,
            BloodInformation.value[3].hemoglobin,
            BloodInformation.value[4].hemoglobin,
          ],
        }
        dataset.push(datas)
      }
      if (CheckFBS.value === true) {
        const datas = {
          label: '공복혈당',
          borderColor: 'rgb(255, 99, 132)',
          data: [
            BloodInformation.value[0].fasting_blood_sugar,
            BloodInformation.value[1].fasting_blood_sugar,
            BloodInformation.value[2].fasting_blood_sugar,
            BloodInformation.value[3].fasting_blood_sugar,
            BloodInformation.value[4].fasting_blood_sugar,
          ],
        }
        dataset.push(datas)
      }
      if (CheckTC.value === true) {
        const datas = {
          label: '총콜레스테롤',
          borderColor: 'rgb(79, 99, 132)',
          data: [
            BloodInformation.value[0].total_cholesterol,
            BloodInformation.value[1].total_cholesterol,
            BloodInformation.value[2].total_cholesterol,
            BloodInformation.value[3].total_cholesterol,
            BloodInformation.value[4].total_cholesterol,
          ],
        }
        dataset.push(datas)
      }
      if (CheckHDL.value === true) {
        const datas = {
          label: 'HDL-콜레스테롤',
          borderColor: 'rgb(200, 50, 100)',
          data: [
            BloodInformation.value[0].hdl_cholesterol,
            BloodInformation.value[1].hdl_cholesterol,
            BloodInformation.value[2].hdl_cholesterol,
            BloodInformation.value[3].hdl_cholesterol,
            BloodInformation.value[4].hdl_cholesterol,
          ],
        }
        dataset.push(datas)
      }
      if (CheckTri.value === true) {
        const datas = {
          label: '중성지방',
          borderColor: 'rgb(150, 200, 50)',
          data: [
            BloodInformation.value[0].triglycerides,
            BloodInformation.value[1].triglycerides,
            BloodInformation.value[2].triglycerides,
            BloodInformation.value[3].triglycerides,
            BloodInformation.value[4].triglycerides,
          ],
        }
        dataset.push(datas)
      }
      if (CheckLDL.value === true) {
        const datas = {
          label: 'LDL-콜레스테롤',
          borderColor: 'rgb(100, 150, 200)',
          data: [
            BloodInformation.value[0].ldl_cholesterol,
            BloodInformation.value[1].ldl_cholesterol,
            BloodInformation.value[2].ldl_cholesterol,
            BloodInformation.value[3].ldl_cholesterol,
            BloodInformation.value[4].ldl_cholesterol,
          ],
        }
        dataset.push(datas)
      }
      if (CheckSC.value === true) {
        const datas = {
          label: '혈청크레아티닌',
          borderColor: 'rgb(50, 100, 200)',
          data: [
            BloodInformation.value[0].serum_creatinine,
            BloodInformation.value[1].serum_creatinine,
            BloodInformation.value[2].serum_creatinine,
            BloodInformation.value[3].serum_creatinine,
            BloodInformation.value[4].serum_creatinine,
          ],
        }
        dataset.push(datas)
      }
      if (CheckGFR.value === true) {
        const datas = {
          label: '신사구체여과율(e-GFR)',
          borderColor: 'rgb(220, 120, 40)',
          data: [
            BloodInformation.value[0].glomerular_filtration_rate,
            BloodInformation.value[1].glomerular_filtration_rate,
            BloodInformation.value[2].glomerular_filtration_rate,
            BloodInformation.value[3].glomerular_filtration_rate,
            BloodInformation.value[4].glomerular_filtration_rate,
          ],
        }
        dataset.push(datas)
      }
      if (CheckAST.value === true) {
        const datas = {
          label: 'AST(SGOT)',
          borderColor: 'rgb(30, 180, 220)',
          data: [
            BloodInformation.value[0].ast,
            BloodInformation.value[1].ast,
            BloodInformation.value[2].ast,
            BloodInformation.value[3].ast,
            BloodInformation.value[4].ast,
          ],
        }
        dataset.push(datas)
      }
      if (CheckALT.value === true) {
        const datas = {
          label: 'ALT(SGPT)',
          borderColor: 'rgb(30, 140, 170)',
          data: [
            BloodInformation.value[0].alt,
            BloodInformation.value[1].alt,
            BloodInformation.value[2].alt,
            BloodInformation.value[3].alt,
            BloodInformation.value[4].alt,
          ],
        }
        dataset.push(datas)
      }
      if (CheckGG.value === true) {
        const datas = {
          label: '감마지티피(v-GTP)',
          borderColor: 'rgb(30, 140, 170)',
          data: [
            BloodInformation.value[0].gamma_gt,
            BloodInformation.value[1].gamma_gt,
            BloodInformation.value[2].gamma_gt,
            BloodInformation.value[3].gamma_gt,
            BloodInformation.value[4].gamma_gt,
          ],
        }
        dataset.push(datas)
      }
      // 차트 파괴하기
      const existingChart = chart.value ? Chart.getChart(chart.value) : null
      if (existingChart) {
        existingChart.destroy()
      }

      // 차트 다시만들기
      if (chart.value) {
        const ctx = chart.value.getContext('2d')

        if (ctx) {
          new Chart(ctx, {
            type: 'line',
            data: {
              labels: [
                BloodInformation.value[0].record_date.slice(0, 10),
                BloodInformation.value[1].record_date.slice(0, 10),
                BloodInformation.value[2].record_date.slice(0, 10),
                BloodInformation.value[3].record_date.slice(0, 10),
                BloodInformation.value[4].record_date.slice(0, 10),
              ],
              datasets: dataset,
            },
          })
        }
      }
    }

    return {
      chart,
      CheckHemo,
      CheckFBS,
      CheckTC,
      CheckHDL,
      CheckTri,
      CheckLDL,
      CheckSC,
      CheckGFR,
      CheckAST,
      CheckALT,
      CheckGG,
      updateChart,
      runMethods,
    }
  },
}

const route = useRoute()
</script>
<template>
  <VRow>
    <VCol cols="3">
      <VCard>
        <VCardTitle>항목 선택</VCardTitle>
        <div class="list-content">
          <VCheckbox
            label="혈색소"
            v-model="CheckHemo"
            style="margin-left: 10px"
          ></VCheckbox>
          <VCheckbox
            label="공복혈당"
            v-model="CheckFBS"
            style="margin-left: 10px"
          ></VCheckbox>
          <VCheckbox
            label="총-콜레스테롤"
            v-model="CheckTC"
            style="margin-left: 10px"
          ></VCheckbox>
          <VCheckbox
            label="HDL-콜레스테롤"
            v-model="CheckHDL"
            style="margin-left: 10px"
          ></VCheckbox>
          <VCheckbox
            label="중성지방"
            v-model="CheckTri"
            style="margin-left: 10px"
          ></VCheckbox>
          <VCheckbox
            label="LDL-콜레스테롤"
            v-model="CheckLDL"
            style="margin-left: 10px"
          ></VCheckbox>
          <VCheckbox
            label="혈청크레아티닌"
            v-model="CheckSC"
            style="margin-left: 10px"
          ></VCheckbox>
          <VCheckbox
            label="신사구체여과율"
            v-model="CheckGFR"
            style="margin-left: 10px"
          ></VCheckbox>
          <VCheckbox
            label="AST"
            v-model="CheckAST"
            style="margin-left: 10px"
          ></VCheckbox>
          <VCheckbox
            label="ALT"
            v-model="CheckALT"
            style="margin-left: 10px"
          ></VCheckbox>
          <VCheckbox
            label="감마지티피"
            v-model="CheckGG"
            style="margin-left: 10px"
          ></VCheckbox>
          <div
            class="text-center"
            style="margin: 10px"
          >
            <VBtn @click="runMethods">선택!</VBtn>
          </div>
        </div>
      </VCard>
    </VCol>
    <VCol cols="9">
      <VCard>
        <canvas ref="chart"></canvas>
      </VCard>
    </VCol>
  </VRow>
</template>
<style lang='scss'>
.list-content {
  padding-left: 10;
}
</style>