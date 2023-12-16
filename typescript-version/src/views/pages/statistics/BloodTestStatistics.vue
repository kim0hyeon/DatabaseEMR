<script lang='ts'>
import axios from 'axios'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

// 차트 그래프 만들기
export default {
  setup() {
    const chartRef = ref<HTMLCanvasElement | null>(null)

    onMounted(() => {
      if (chartRef.value) {
        const ctx = chartRef.value.getContext('2d')
        if (ctx) {
          new Chart(ctx, {
            type: 'line',
            data: {
              labels: ['2023-12-04', '2023-12-06', '2023-12-08', '2023-12-10', '2023-12-12'],
              datasets: [
                {
                  label: '선택항목 1',
                  borderColor: 'rgb(75, 192, 192)',
                  data: [0, 10, 5, 2, 20],
                },
                {
                  label: '선택항목 2',
                  borderColor: 'rgb(255, 99, 132)',
                  data: [5, 15, 10, 7, 25],
                },
                {
                  label: '선택항목 3',
                  borderColor: 'rgb(79, 99, 132)',
                  data: [20, 8, 13, 9, 20],
                },
              ],
            },
            options: {
              // 원하는 차트 옵션 설정
            },
          })
        }
      }
    })

    return { chartRef }
  },
}

const route = useRoute()

// 혈액검사 테스트 기록 정보 받아오기 (속성들은 이름 정하면 그때 넣기)
interface InBodyTest {
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
let InBodyTestRecord = ref<InBodyTest[]>([])

// 오류나지 않게 임시로 url 넣어놨음. 혈액검사에 맞는 url로 고쳐줘야함
onMounted(async () => {
  try {
    const response = await axios.get('http;//yunsseong.uk:8000/api/patients/') // 수정 필요
    const InBodyTestRecord = response.data // 가져온 데이터를 어떻게 가공하여 사용할지 정의 필요
    console.log('Blood test record loading success')
  } catch (error) {
    console.error(error)
  }
})
</script>
<template>
  <div>
    <canvas ref="chartRef"></canvas>
  </div>
</template>
<style lang='scss'>
</style>