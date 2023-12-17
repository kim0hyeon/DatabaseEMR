<script lang='ts'>
import axios from 'axios'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import { IdStore } from '@/store'

// 인바디 테스트 기록 정보 받아오기 (속성들은 이름 정하면 그때 넣기)
interface InBodyTest {
  record_date: string
  patient_id: string
  inbody_id: string
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
}

// 인바디기록을 저장할 리스트 생성 -> 쓰레기값
const InBodyTests: InBodyTest[] = [
  {
    patient_id: 'asfdasdf',
    inbody_id: 'asdfasdf',
    record_date: '2023-12-04',
    weight: 70,
    muscle_mass: 32,
    body_fat_mass: 16,
    bmi: 24,
    percent_body_fat: 20,
    right_arm: 14,
    left_arm: 13,
    trunk: 26,
    right_leg: 22,
    left_leg: 21,
  },
  {
    patient_id: 'asfdasdf',
    inbody_id: 'asdfasdf',
    record_date: '2023-12-06',
    weight: 75,
    muscle_mass: 35,
    body_fat_mass: 18,
    bmi: 25,
    percent_body_fat: 22,
    right_arm: 16,
    left_arm: 15,
    trunk: 28,
    right_leg: 24,
    left_leg: 23,
  },
  {
    patient_id: 'asfdasdf',
    inbody_id: 'asdfasdf',
    record_date: '2023-12-08',
    weight: 85,
    muscle_mass: 40,
    body_fat_mass: 22,
    bmi: 27,
    percent_body_fat: 26,
    right_arm: 20,
    left_arm: 19,
    trunk: 32,
    right_leg: 28,
    left_leg: 27,
  },
  {
    patient_id: 'asfdasdf',
    inbody_id: 'asdfasdf',
    record_date: '2023-12-10',
    weight: 65,
    muscle_mass: 30,
    body_fat_mass: 15,
    bmi: 23,
    percent_body_fat: 18,
    right_arm: 12,
    left_arm: 11,
    trunk: 25,
    right_leg: 20,
    left_leg: 19,
  },
  {
    patient_id: 'asfdasdf',
    inbody_id: 'asdfasdf',
    record_date: '2023-12-12',
    weight: 80,
    muscle_mass: 38,
    body_fat_mass: 20,
    bmi: 26,
    percent_body_fat: 24,
    right_arm: 18,
    left_arm: 17,
    trunk: 30,
    right_leg: 26,
    left_leg: 25,
  },
]
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
    console.log(InBodyInformation.value[0].weight)
  } catch (error) {
    console.log(error)
  }
}

// 그래프 만들고 없애기
export default {
  setup() {
    const chart = ref<HTMLCanvasElement | null>(null)
    const isCheckedW = ref(false)
    const isCheckedMM = ref(false)
    const isCheckedBFM = ref(false)
    const isCheckedBMI = ref(false)
    const isCheckedPDF = ref(false)
    const isCheckedRA = ref(false)
    const isCheckedLA = ref(false)
    const isCheckedT = ref(false)
    const isCheckedRL = ref(false)
    const isCheckedLL = ref(false)

    // patient.id가 바뀌었을 경우 실행할 로직
    watch(store, (newValue, oldValue) => {
      loadInBodyData()
      console.log('patient.id값이 변경되었습니다.')
    })

    const runMethods = () => {
      loadInBodyData()
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
                InBodyTests[0].record_date,
                InBodyTests[1].record_date,
                InBodyTests[2].record_date,
                InBodyTests[3].record_date,
                InBodyTests[4].record_date,
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
      loadInBodyData()
      drawChart()
    })

    // 그래프를 업데이트하는 함수
    const updateChart = () => {
      console.log('그래프 업데이트!')
      const dataset = []
      if (isCheckedW.value === true) {
        const datas = {
          label: '체중',
          borderColor: 'rgb(75, 192, 192)',
          data: [
            InBodyInformation.value[0].weight,
            InBodyInformation.value[1].weight,
            InBodyInformation.value[2].weight,
            InBodyInformation.value[3].weight,
            InBodyInformation.value[4].weight,
          ],
        }
        dataset.push(datas)
      }
      if (isCheckedMM.value === true) {
        const datas = {
          label: '근육량',
          borderColor: 'rgb(255, 99, 132)',
          data: [
            InBodyInformation.value[0].muscle_mass,
            InBodyInformation.value[1].muscle_mass,
            InBodyInformation.value[2].muscle_mass,
            InBodyInformation.value[3].muscle_mass,
            InBodyInformation.value[4].muscle_mass,
          ],
        }
        dataset.push(datas)
      }
      if (isCheckedBFM.value === true) {
        const datas = {
          label: '체지방량',
          borderColor: 'rgb(79, 99, 132)',
          data: [
            InBodyInformation.value[0].body_fat_mass,
            InBodyInformation.value[1].body_fat_mass,
            InBodyInformation.value[2].body_fat_mass,
            InBodyInformation.value[3].body_fat_mass,
            InBodyInformation.value[4].body_fat_mass,
          ],
        }
        dataset.push(datas)
      }
      if (isCheckedBMI.value === true) {
        const datas = {
          label: 'BMI',
          borderColor: 'rgb(200, 50, 100)',
          data: [
            InBodyInformation.value[0].bmi,
            InBodyInformation.value[1].bmi,
            InBodyInformation.value[2].bmi,
            InBodyInformation.value[3].bmi,
            InBodyInformation.value[4].bmi,
          ],
        }
        dataset.push(datas)
      }
      if (isCheckedPDF.value === true) {
        const datas = {
          label: '체지방률',
          borderColor: 'rgb(150, 200, 50)',
          data: [
            InBodyInformation.value[0].percent_body_fat,
            InBodyInformation.value[1].percent_body_fat,
            InBodyInformation.value[2].percent_body_fat,
            InBodyInformation.value[3].percent_body_fat,
            InBodyInformation.value[4].percent_body_fat,
          ],
        }
        dataset.push(datas)
      }
      if (isCheckedRA.value === true) {
        const datas = {
          label: '오른팔',
          borderColor: 'rgb(100, 150, 200)',
          data: [
            InBodyInformation.value[0].right_arm,
            InBodyInformation.value[1].right_arm,
            InBodyInformation.value[2].right_arm,
            InBodyInformation.value[3].right_arm,
            InBodyInformation.value[4].right_arm,
          ],
        }
        dataset.push(datas)
      }
      if (isCheckedLA.value === true) {
        const datas = {
          label: '왼팔',
          borderColor: 'rgb(50, 100, 200)',
          data: [
            InBodyInformation.value[0].left_arm,
            InBodyInformation.value[1].left_arm,
            InBodyInformation.value[2].left_arm,
            InBodyInformation.value[3].left_arm,
            InBodyInformation.value[4].left_arm,
          ],
        }
        dataset.push(datas)
      }
      if (isCheckedT.value === true) {
        const datas = {
          label: '몸통',
          borderColor: 'rgb(220, 120, 40)',
          data: [
            InBodyInformation.value[0].trunk,
            InBodyInformation.value[1].trunk,
            InBodyInformation.value[2].trunk,
            InBodyInformation.value[3].trunk,
            InBodyInformation.value[4].trunk,
          ],
        }
        dataset.push(datas)
      }
      if (isCheckedRL.value === true) {
        const datas = {
          label: '오른다리',
          borderColor: 'rgb(30, 180, 220)',
          data: [
            InBodyInformation.value[0].right_leg,
            InBodyInformation.value[1].right_leg,
            InBodyInformation.value[2].right_leg,
            InBodyInformation.value[3].right_leg,
            InBodyInformation.value[4].right_leg,
          ],
        }
        dataset.push(datas)
      }
      if (isCheckedLL.value === true) {
        const datas = {
          label: '왼다리',
          borderColor: 'rgb(30, 140, 170)',
          data: [
            InBodyInformation.value[0].left_leg,
            InBodyInformation.value[1].left_leg,
            InBodyInformation.value[2].left_leg,
            InBodyInformation.value[3].left_leg,
            InBodyInformation.value[4].left_leg,
          ],
        }
        dataset.push(datas)
      }

      // 기존차트 파괴하기
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
                InBodyInformation.value[0].record_date.slice(0, 10),
                InBodyInformation.value[1].record_date.slice(0, 10),
                InBodyInformation.value[2].record_date.slice(0, 10),
                InBodyInformation.value[3].record_date.slice(0, 10),
                InBodyInformation.value[4].record_date.slice(0, 10),
              ],
              datasets: dataset,
            },
          })
        }
      }
    }

    return {
      chart,
      isCheckedW,
      isCheckedMM,
      isCheckedBFM,
      isCheckedBMI,
      isCheckedPDF,
      isCheckedRA,
      isCheckedLA,
      isCheckedT,
      isCheckedRL,
      isCheckedLL,
      updateChart,
      drawChart,
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
            label="체중"
            v-model="isCheckedW"
            style="margin-left: 10px"
          ></VCheckbox>
          <VCheckbox
            label="근육량"
            v-model="isCheckedMM"
            style="margin-left: 10px"
          ></VCheckbox>
          <VCheckbox
            label="체지방량"
            v-model="isCheckedBFM"
            style="margin-left: 10px"
          ></VCheckbox>
          <VCheckbox
            label="BMI"
            v-model="isCheckedBMI"
            style="margin-left: 10px"
          ></VCheckbox>
          <VCheckbox
            label="오른팔"
            v-model="isCheckedRA"
            style="margin-left: 10px"
          ></VCheckbox>
          <VCheckbox
            label="왼팔"
            v-model="isCheckedLA"
            style="margin-left: 10px"
          ></VCheckbox>
          <VCheckbox
            label="몸통"
            v-model="isCheckedT"
            style="margin-left: 10px"
          ></VCheckbox>
          <VCheckbox
            label="오른다리"
            v-model="isCheckedRL"
            style="margin-left: 10px"
          ></VCheckbox>
          <VCheckbox
            label="왼다리"
            v-model="isCheckedLL"
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