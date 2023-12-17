<script lang='ts'>
import axios from 'axios'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import InBodyTestData from '@/exampleJson/inbodytest.json'

interface InBodyTestCase {
  id: string
  name: string
}

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
}

// 인바디기록을 저장할 리스트 생성 -> 변경 가능해야함
let InBodyTestRecord = ref<InBodyTest[]>([])

// 그래프 만들고 없애기
export default {
  setup() {
    const chart = ref<HTMLCanvasElement | null>(null)

    onMounted(() => {
      if (chart.value) {
        const ctx = chart.value.getContext('2d')
        const testcaselist = ref<InBodyTestCase[]>(InBodyTestData['inbodytest'])

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

    return { chart }
  },
}
const route = useRoute()
</script>
<template>
  <VRow>
    <VCol cols="3">
      <VCard>
        <VCardTitle>항목 선택</VCardTitle>
        <VCardContent> </VCardContent>
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
</style>