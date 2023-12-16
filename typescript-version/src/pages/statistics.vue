<script setup lang="ts">
import avatar1 from '@images/avatars/avatar-1.png'
import axios from 'axios'
import { Ref } from 'vue'
import { useRoute } from 'vue-router'
import PatientData from './PatientData.json'
import BloodTestStatistics from '@/views/pages/statistics/BloodTestStatistics.vue'
import InBodyTestStatistics from '@/views/pages/statistics/InBodyTestStatistics.vue'

const route = useRoute()

const refInputEl = ref<HTMLElement>()

// 모달창 구현
const isModalOpen = ref(false)
const openModal = () => {
  isModalOpen.value = true
}

const statisticsroute = useRoute()

const activeTab = ref(statisticsroute.params.tab)

const tabs = [
  { title: '인바디 통계', icon: 'mdi-camera', tab: 'inbody' },
  { title: '혈액검사 통계', icon: 'mdi-water', tab: 'blood' },
]
</script>

<template>
  <div>
    <VTabs
      v-model="activeTab"
      show-arrows
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>

    <VDivider />

    <VWindow
      v-model="activeTab"
      class="mt-5 disable-tab-transition"
    >
      <!-- 운동능력 -->
      <VWindowItem value="inbody">
        <InBodyTestStatistics />
      </VWindowItem>

      <!-- 혈액 검사 -->
      <VWindowItem value="blood">
        <BloodTestStatistics />
      </VWindowItem>
    </VWindow>
  </div>
</template>

<style lang="scss">
@use '@core/scss/pages/page-auth.scss';

.stat-btn {
  padding: 8px;
  border: 3px solid blueviolet;
  border-radius: 7px;
  font-size: 14px;
}

/* 검색어 자동 완성 스타일 */
.search-container {
  position: relative;
  inline-size: 70%;
}

.search-results {
  position: absolute;
  z-index: 999;
  inline-size: 30%;
  inset-block-start: 100%;
}

/* 환자 사진 스타일 */
.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 100%;
  inline-size: 100%;
  justify-items: center;
}

.avatar {
  block-size: 100%;
  inline-size: 150px;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  transform: translate(-15%, -50%);
}

.avatar img {
  block-size: 100%;
  inline-size: 100%;
  object-fit: cover;
}

/* 내원 기록 카드 스크롤바 변환 및 재방문 사유 카드와 높이 맞춤 */
.full-height {
  block-size: 250px;
}

.scrollable-area {
  max-block-size: 135px;
  overflow-y: auto;
}

/* 검색어 자동완성 창 폭 조절 */
#autoSearch {
  width: 550px;
}

.search-condition {
  width: 140px;
}

.card-style {
  margin: 30px;
  padding: 20px;
}
</style>
