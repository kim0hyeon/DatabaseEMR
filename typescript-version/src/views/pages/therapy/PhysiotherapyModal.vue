<script setup lang='ts'>
import axios from 'axios'
import { Chart, Patient, Reception } from "@/pages/interfaces";
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { IdStore } from "@/store";
import Scan from "@/pages/Scan.vue";
import MedicalRecord from "@/pages/MedicalRecord.vue";

const route = useRoute()
const store = IdStore()
const token = sessionStorage.getItem('token')

// 백엔드에서 환자 정보 받아오기
let receptionInfo = ref<Reception>()
let chartInfo = ref<Chart[]>([])
let recentlyChartInfo = ref<Chart>()

const getReceptionInfo = (async (id: string) => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/receptions?patient=${ id }`, {
      headers: { Authorization: `Token ${token}` },
    })
    receptionInfo.value = response.data[0]
    console.log('reception data loding success')
  } catch (error) {
    console.error(error)
  }
})

const getChartInfo = (async (id: string) => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/chart?patient=${ id }`, {
      headers: { Authorization: `Token ${token}` },
    })
    chartInfo.value = response.data
    recentlyChartInfo.value = response.data[0]
    console.log('chart data loding success')
  } catch (error) {
    console.error(error)
  }
})

watch(() => {
  return store.id
}, async (newId, oldId) => {
  console.log(`ID changed from ${oldId} to ${newId}`)
  console.log(newId)
  await getReceptionInfo(newId)
  await getChartInfo(newId)
  console.log(chartInfo.value)
})

const Cards = reactive<number[]>([])
function addCard() {
  Cards.push(Cards.length + 1)
  // console.log(Cards);
}
function subCard() {
  Cards.pop()
  // console.log(Cards)
}

// 진료기록 모달
let selectedChartId = ref('')
let selectedReceptionId = ref('')
const isRecordOpen = ref(false)
const openRecord = (chart_id: string, reception_id: string) => {
  console.log(reception_id)
  isRecordOpen.value = true
  selectedChartId.value = chart_id
  selectedReceptionId.value = reception_id
}

// 스캔 모달
const isScanOpen = ref(false)
const OpenScanning = () => {
  console.log(isScanOpen.value)
  isScanOpen.value = true
  console.log(isScanOpen.value)
}
</script>
<template>
  <VRow>
    <VCol
        class="pa-0"
        cols="3"
    >
      <div class="pat_list">
        <VCard class="pa-4">
          <VRow>
            <VCol
                cols="12"
                md="6"
            >
              <h3 class="letter-spacing">{{ receptionInfo?.patient.patient_name ?? '이름' }}</h3>
            </VCol>
            <VCol
                cols="12"
                md="6"
                class="mt-1"
            >
              <Scan v-model="isScanOpen" />
              <VBtn
                  @click="OpenScanning"
                  class="right-btn"
              >Scan</VBtn
              >
            </VCol>
          </VRow>
          <VDivider />

          <h3 class="mt-4 ml-2 mb-4"><b>내원이력</b></h3>
          <div class="scroll-container history">
            <VCard class="px-1 py-1">
              <MedicalRecord
                  v-model="isRecordOpen"
                  :chart_id="selectedChartId"
                  :reception_id="selectedReceptionId"
              />
              <VCard
                  v-if="chartInfo"
                  v-for="item in chartInfo"
                  :key="item.chart_id"
                  class="visit-history-box ma-1"
                  @click="openRecord(item.chart_id, receptionInfo?.reception_id)"
              >
                <h4 class="letter-spacing">진료날짜: {{ item.date_only }}</h4>
                <h4 class="letter-spacing">병 아이디: {{ item.disease }}</h4>
                <h4 class="letter-spacing">진단: {{ item.diagnosis }}</h4>
              </VCard>
            </VCard>
          </div>
        </VCard>
      </div>
    </VCol>
    <VCol cols="9">
      <VRow>
        <VCol cols="9">
          <VCard class="px-2 py-2">
            <div class="letter-spacing">
              <img
                src="../../../assets/icons/stethoscope.png"
                class="large-icon-size"
              />
              <h2>진단 기록</h2>
            </div>
            <VCardText
                readonly
                outline
                rows="2"
                auto-grow
                style="border: 1px solid; border-radius: 5px"
                class="ml-2 mr-2 cardText"
            >{{ recentlyChartInfo?.diagnosis }}</VCardText>
          </VCard>
        </VCol>
        <VCol cols="3">
          <VCard class="px-2 py-2">
            <div class="letter-spacing">
              <img
                src="../../../assets/icons/picture.png"
                class="large-icon-size"
              />
              <h2>사진</h2>
            </div>
            <VFileInput></VFileInput>
            <!-- <div>
              <img :src='imgpath.path1' class="upload-img">
            </div> -->
          </VCard>
        </VCol>
      </VRow>
      <VTab></VTab>
      <VCard class="px-2 py-2">
        <div class="letter-spacing">
          <img
            src="../../../assets/icons/prescription.png"
            class="large-icon-size"
          />
          <h2>물리치료</h2>
        </div>
        <div>
          <!-- 버튼 -->
          <VRow>
            <VCol>
              <VBtn
                @click="addCard"
                style="margin-bottom: 10px"
                >치료 추가</VBtn
              >
            </VCol>
            <VCol>
              <VBtn
                @click="subCard"
                style="margin-bottom: 10px"
                >치료 삭제</VBtn
              >
            </VCol>
          </VRow>
          <VCard
            v-for="(i, index) in Cards"
            :key="index"
            class="therapy-card"
          >
            <VCardTitle>카드제목 {{ index }}</VCardTitle>
            <VCardText>카드의 내용을 작성하세요.</VCardText>
          </VCard>
        </div>
        <VTextarea
          label="치료 후기 입력"
          outline
          rows="5"
          auto-grow
          style="margin-bottom: 5px"
        ></VTextarea>
        <VBtn style="border-radius: 13px; font-size: 15px">저장</VBtn>
      </VCard>
    </VCol>
  </VRow>
</template>
<style>
@use '@core/scss/pages/page-auth.scss';

.visit-history-box {
  margin-block-end: 10px;
}

.letter-spacing {
  padding: 10px;
}

.large-icon-size {
  block-size: 30px;
  float: inline-start;
  inline-size: auto;
  margin-inline-end: 10px;
}

.small-icon-size {
  block-size: 24px;
  float: inline-start;
  inline-size: auto;
  margin-inline-end: 10px;
}

.upload-img {
  padding: 20px;
  block-size: auto;
  inline-size: 100%;
}

.therapy-card {
  margin-block: 10px;
}
</style>
