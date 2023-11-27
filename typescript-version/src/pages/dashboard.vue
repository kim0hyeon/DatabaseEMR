<script setup lang="ts">
import AnalyticsAward from '@/views/dashboard/AnalyticsAward.vue';
import AnalyticsBarCharts from '@/views/dashboard/AnalyticsBarCharts.vue';
import AnalyticsDepositWithdraw from '@/views/dashboard/AnalyticsDepositWithdraw.vue';
import AnalyticsSalesByCountries from '@/views/dashboard/AnalyticsSalesByCountries.vue';
import AnalyticsTotalEarning from '@/views/dashboard/AnalyticsTotalEarning.vue';
import AnalyticsTotalProfitLineCharts from '@/views/dashboard/AnalyticsTotalProfitLineCharts.vue';
import AnalyticsTransactions from '@/views/dashboard/AnalyticsTransactions.vue';
import AnalyticsUserTable from '@/views/dashboard/AnalyticsUserTable.vue';
import AnalyticsWeeklyOverview from '@/views/dashboard/AnalyticsWeeklyOverview.vue';
import CardStatisticsVertical from '@core/components/cards/CardStatisticsVertical.vue';
import jsQR from 'jsqr'

const totalProfit = {
  title: 'Total Profit',
  color: 'secondary',
  icon: 'mdi-poll',
  stats: '$25.6k',
  change: 42,
  subtitle: 'Weekly Project',
}

const newProject = {
  title: 'New Project',
  color: 'primary',
  icon: 'mdi-briefcase-variant-outline',
  stats: '862',
  change: -18,
  subtitle: 'Yearly Project',
}


// QR 코드 인식
const video = ref<HTMLVideoElement | null>(null);
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let animationFramedId: number | null = null;

const startScanning = () => {
  navigator.mediaDevices.getUserMedia({ video: {facingMode: "enviroment"} }).then(function(stream) {
    if (video.value) {
      video.value.srcObject = stream;
      video.value.setAttribute('playsinline', 'true');
      video.value.play();
      tick();
    }
  })
}

function tick() {
  if (video.value && video.value.readyState === video.value.HAVE_ENOUGH_DATA) {
    if (!canvas){
      canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d')!;
    }
    canvas.width = video.value.videoWidth;
    canvas.height = video.value.videoHeight;
    ctx.drawImage(video.value, 0, 0, canvas.width, canvas.height);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code) {
      console.log('Found QR code', code.data);
      window.open(code.data, '_blank');
    }
  }
  requestAnimationFrame(tick);
}
</script>

<template>
  <!-- QR 버튼 -->
  <VBtn @click="startScanning">Start Scanning</VBtn>
  <video ref="video"></video>

  <!-- 기존 코드 -->
  <VRow class="match-height">
    <VCol
      cols="12"
      md="4"
    >
      <AnalyticsAward />
    </VCol>

    <VCol
      cols="12"
      md="8"
    >
      <AnalyticsTransactions />
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <AnalyticsWeeklyOverview />
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <AnalyticsTotalEarning />
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <VRow class="match-height">
        <VCol
          cols="12"
          sm="6"
        >
          <AnalyticsTotalProfitLineCharts />
        </VCol>

        <VCol
          cols="12"
          sm="6"
        >
          <CardStatisticsVertical v-bind="totalProfit" />
        </VCol>

        <VCol
          cols="12"
          sm="6"
        >
          <CardStatisticsVertical v-bind="newProject" />
        </VCol>

        <VCol
          cols="12"
          sm="6"
        >
          <AnalyticsBarCharts />
        </VCol>
      </VRow>
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <AnalyticsSalesByCountries />
    </VCol>

    <VCol
      cols="12"
      md="8"
    >
      <AnalyticsDepositWithdraw />
    </VCol>

    <VCol cols="12">
      <AnalyticsUserTable />
    </VCol>
  </VRow>
</template>
