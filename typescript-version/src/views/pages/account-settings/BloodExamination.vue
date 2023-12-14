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
      if (chart2.value) {
        const ctx = chart2.value.getContext('2d')
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

      if (chart3.value) {
        const ctx = chart3.value.getContext('2d')
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

      if (chart4.value) {
        const ctx = chart4.value.getContext('2d')
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

      if (chart5.value) {
        const ctx = chart5.value.getContext('2d')
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
      chart1,
      chart2,
      chart3,
      chart4,
      chart5,
    }
  },
})
</script>

<template>
  <VRow>
    <VCol>
      <h2 style="margin-left: 10px; margin-bottom: 10px">Blood Test Result</h2>
      <VCard class="container"
        ><table
          border="1"
          class="table-container"
        >
          <tr class="table-content">
            <th>빈혈</th>
            <td>
              <canvas
                ref="chart1"
                height="45"
              ></canvas>
            </td>
          </tr>
          <tr>
            <th>당뇨병</th>
            <td>
              <canvas
                ref="chart2"
                height="45"
              ></canvas>
            </td>
          </tr>
          <tr class="table-content">
            <th>이상지질혈증</th>
            <td>
              <canvas
                ref="chart3"
                height="120"
              ></canvas>
            </td>
          </tr>
          <tr>
            <th>신장질환</th>
            <td>
              <canvas
                ref="chart4"
                height="70"
              ></canvas>
            </td>
          </tr>
          <tr class="table-content">
            <th>간장질환</th>
            <td>
              <canvas
                ref="chart5"
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
</style>