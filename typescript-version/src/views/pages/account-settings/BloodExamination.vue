<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'

export default defineComponent({
  setup() {
    const chartCanvas = ref<HTMLCanvasElement | null>(null)

    onMounted(() => {
      if (chartCanvas.value) {
        const ctx = chartCanvas.value.getContext('2d')
        if (ctx) {
          Chart.register(...registerables)

          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['혈액 검사 항목1', '혈액 검사 항목2', '혈액 검사 항목3'],
              datasets: [
                {
                  label: '혈액 검사 결과',
                  data: [80, 60, 75], // 실제 데이터 입력
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              scales: {
                x: {
                  type: 'category',
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
      chartCanvas,
    }
  },
})
</script>

<template>
  <canvas ref="chartCanvas"></canvas>

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
              <p>혈색소 그래프1</p>
            </td>
            <td></td>
          </tr>
          <tr>
            <th>당뇨병</th>
            <td>
              <p>공복혈당 그래프1</p>
            </td>
          </tr>
          <tr class="table-content">
            <th>이상지질혈증</th>
            <td>
              <p>총 콜레스테롤 그래프1</p>
              <p>HDL-콜레스테롤 그래프2</p>
              <p>중성지방</p>
              <p>LDL-콜레스테롤</p>
            </td>
          </tr>
          <tr>
            <th>신장질환</th>
            <td>
              <p>혈청 크레아티닌 그래프1</p>
              <p>신사구체여과율(e-GFR) 그래프2</p>
            </td>
          </tr>
          <tr class="table-content">
            <th>간장질환</th>
            <td>
              <p>AST(SGOT)</p>
              <p>ALT(SGPT)</p>
              <p>감마지티피(v-GTP)</p>
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