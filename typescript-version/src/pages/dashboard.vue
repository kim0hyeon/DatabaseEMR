<script setup lang="ts">
import { useUserStore } from '@/store';
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
import jsQR from 'jsqr';
import { watch } from 'vue';
import { useRouter } from 'vue-router';
const loginStore = useUserStore();
const router =  useRouter();
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
let animationFrameId: number | null = null;
let stream: MediaStream | null = null;
const showVideo = ref(false);
const startScanning = () => {
  showVideo.value = !showVideo.value;
  console.log(showVideo.value)
  if(showVideo.value){
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment"  } }).then(function (s) {
    if (video.value) {
      stream = s;
      video.value.srcObject = stream;
      video.value.setAttribute('playsinline', 'true');
      video.value.play();
      tick();
    }
    
  })}
  else{
    stopScanning();
  };
}

const stopScanning = () => {
  if (stream) {
    //초기화 과정 
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    stream = null;
    video.value.srcObject = null;
    video.value.removeAttribute('src');
    video.value.removeAttribute('playsinline');
  }

  cancelAnimationFrame(animationFrameId!);
  animationFrameId = null;
}

function tick() {
  if (video.value && video.value.readyState === video.value.HAVE_ENOUGH_DATA) {
    if (!canvas) {
      canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d')!;
    }
    // 인식 범위 절반으로 줄임 
    canvas.width = video.value.videoWidth/2;
    canvas.height = video.value.videoHeight/2;
    ctx.drawImage(video.value, 0, 0, canvas.width, canvas.height);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code) {
      showVideo.value = false
      console.log('Found QR code', code.data);
      window.open(code.data, '_blank');
      stopScanning();
    }
  }
  animationFrameId = requestAnimationFrame(tick);
}


watch(
  () => showVideo.value,
  (newP, oldP) => {
    console.log(`showVideo changed from ${oldP} to ${newP}`);
  }
);
const foo = sessionStorage.getItem('token');

const foo1 = loginStore.$state.userInfo?.name;
const foo2 = loginStore.$state.userInfo?.job;
</script>
<template>
  {{ foo }}
  {{ foo1 }}
  {{ foo2 }}
  <!-- QR 버튼 -->
  <VBtn @click="startScanning">SCAN</VBtn>
  <div v-show="showVideo">
      <video ref="video"></video>
    </div>
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
