<script lang='ts'>
import axios from 'axios'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

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
  date_time: string
}

const bloodTests: BloodTest[] = [
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
    date_time: '2023-12-04',
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
    date_time: '2023-12-06',
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
    date_time: '2023-12-08',
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
    date_time: '2023-12-10',
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
    date_time: '2023-12-12',
  },
]

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

    // 그래프를 그리는 함수
    const drawChart = () => {
      if (chart.value) {
        const ctx = chart.value.getContext('2d')

        if (ctx) {
          new Chart(ctx, {
            type: 'line',
            data: {
              labels: [
                bloodTests[0].date_time,
                bloodTests[1].date_time,
                bloodTests[2].date_time,
                bloodTests[3].date_time,
                bloodTests[4].date_time,
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
            bloodTests[0].hemoglobin,
            bloodTests[1].hemoglobin,
            bloodTests[2].hemoglobin,
            bloodTests[3].hemoglobin,
            bloodTests[4].hemoglobin,
          ],
        }
        dataset.push(datas)
      }
      if (CheckFBS.value === true) {
        const datas = {
          label: '공복혈당',
          borderColor: 'rgb(255, 99, 132)',
          data: [
            bloodTests[0].fasting_blood_sugar,
            bloodTests[1].fasting_blood_sugar,
            bloodTests[2].fasting_blood_sugar,
            bloodTests[3].fasting_blood_sugar,
            bloodTests[4].fasting_blood_sugar,
          ],
        }
        dataset.push(datas)
      }
      if (CheckTC.value === true) {
        const datas = {
          label: '총콜레스테롤',
          borderColor: 'rgb(79, 99, 132)',
          data: [
            bloodTests[0].total_cholesterol,
            bloodTests[1].total_cholesterol,
            bloodTests[2].total_cholesterol,
            bloodTests[3].total_cholesterol,
            bloodTests[4].total_cholesterol,
          ],
        }
        dataset.push(datas)
      }
      if (CheckHDL.value === true) {
        const datas = {
          label: 'HDL-콜레스테롤',
          borderColor: 'rgb(200, 50, 100)',
          data: [
            bloodTests[0].hdl_cholesterol,
            bloodTests[1].hdl_cholesterol,
            bloodTests[2].hdl_cholesterol,
            bloodTests[3].hdl_cholesterol,
            bloodTests[4].hdl_cholesterol,
          ],
        }
        dataset.push(datas)
      }
      if (CheckTri.value === true) {
        const datas = {
          label: '중성지방',
          borderColor: 'rgb(150, 200, 50)',
          data: [
            bloodTests[0].triglycerides,
            bloodTests[1].triglycerides,
            bloodTests[2].triglycerides,
            bloodTests[3].triglycerides,
            bloodTests[4].triglycerides,
          ],
        }
        dataset.push(datas)
      }
      if (CheckLDL.value === true) {
        const datas = {
          label: 'LDL-콜레스테롤',
          borderColor: 'rgb(100, 150, 200)',
          data: [
            bloodTests[0].ldl_cholesterol,
            bloodTests[1].ldl_cholesterol,
            bloodTests[2].ldl_cholesterol,
            bloodTests[3].ldl_cholesterol,
            bloodTests[4].ldl_cholesterol,
          ],
        }
        dataset.push(datas)
      }
      if (CheckSC.value === true) {
        const datas = {
          label: '혈청크레아티닌',
          borderColor: 'rgb(50, 100, 200)',
          data: [
            bloodTests[0].serum_creatinine,
            bloodTests[1].serum_creatinine,
            bloodTests[2].serum_creatinine,
            bloodTests[3].serum_creatinine,
            bloodTests[4].serum_creatinine,
          ],
        }
        dataset.push(datas)
      }
      if (CheckGFR.value === true) {
        const datas = {
          label: '신사구체여과율(e-GFR)',
          borderColor: 'rgb(220, 120, 40)',
          data: [
            bloodTests[0].glomerular_filtration_rate,
            bloodTests[1].glomerular_filtration_rate,
            bloodTests[2].glomerular_filtration_rate,
            bloodTests[3].glomerular_filtration_rate,
            bloodTests[4].glomerular_filtration_rate,
          ],
        }
        dataset.push(datas)
      }
      if (CheckAST.value === true) {
        const datas = {
          label: 'AST(SGOT)',
          borderColor: 'rgb(30, 180, 220)',
          data: [bloodTests[0].ast, bloodTests[1].ast, bloodTests[2].ast, bloodTests[3].ast, bloodTests[4].ast],
        }
        dataset.push(datas)
      }
      if (CheckALT.value === true) {
        const datas = {
          label: 'ALT(SGPT)',
          borderColor: 'rgb(30, 140, 170)',
          data: [bloodTests[0].alt, bloodTests[1].alt, bloodTests[2].alt, bloodTests[3].alt, bloodTests[4].alt],
        }
        dataset.push(datas)
      }
      if (CheckGG.value === true) {
        const datas = {
          label: '감마지티피(v-GTP)',
          borderColor: 'rgb(30, 140, 170)',
          data: [
            bloodTests[0].gamma_gt,
            bloodTests[1].gamma_gt,
            bloodTests[2].gamma_gt,
            bloodTests[3].gamma_gt,
            bloodTests[4].gamma_gt,
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
                bloodTests[0].date_time,
                bloodTests[1].date_time,
                bloodTests[2].date_time,
                bloodTests[3].date_time,
                bloodTests[4].date_time,
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
    }
  },
}

const route = useRoute()

// 혈액검사 테스트 기록 정보 받아오기 (속성들은 이름 정하면 그때 넣기)
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
}

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
            <VBtn @click="updateChart">선택!</VBtn>
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