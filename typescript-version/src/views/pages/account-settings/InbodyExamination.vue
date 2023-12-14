<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'

export default defineComponent({
  setup() {
    const chart1 = ref<HTMLCanvasElement | null>(null)
    const chart2 = ref<HTMLCanvasElement | null>(null)
    const chart3 = ref<HTMLCanvasElement | null>(null)
    const chart4 = ref<HTMLCanvasElement | null>(null)
    const chart5 = ref<HTMLCanvasElement | null>(null)

    onMounted(() => {
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
              labels: ['BMI', '체지방률', '복부지방률'],
              datasets: [
                {
                  label: '비만진단',
                  data: [25, 25.4, 0.89], // 데이터 입력
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
  <VRow>
    <VCol>
      <h2 style="margin-left: 10px; margin-bottom: 10px">InBody Result</h2>
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
              <div>62.0 - 83.8</div>
              <div>31.3 - 38.3</div>
              <div>8.8 - 17.5</div>
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
              <div>18.5 - 23.0</div>
              <div>10.0 - 20.0</div>
              <div>0.80 - 0.90</div>
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
              <div>85 - 115</div>
              <div>85 - 115</div>
              <div>90 - 110</div>
              <div>90 - 110</div>
              <div>90 - 110</div>
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
}
</style>