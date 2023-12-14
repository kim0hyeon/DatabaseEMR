<script lang="ts" setup>
import CTView from '@/views/pages/medi-imagings/ct.vue'
import MriView from '@/views/pages/medi-imagings/mri.vue'
import XRAYView from '@/views/pages/medi-imagings/x-ray.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const activeTab = ref(route.params.tab)

// tabs
const tabs = [
  { title: 'MRI', icon: 'mdi-panorama-variant-outline', tab: 'MRI' },
  { title: 'X-RAY', icon: 'mdi-skull-scan-outline', tab: 'X-RAY' },
  { title: 'CT', icon: 'mdi-account-arrow-up', tab: 'CT' },
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
      <!-- Account -->
      <VWindowItem value="MRI">
        <MriView />
      </VWindowItem>

      <!-- Security -->
      <VWindowItem value="X-RAY">
        <XRAYView />
      </VWindowItem>

      <!-- Notification -->
      <VWindowItem value="CT">
        <CTView />
      </VWindowItem>
    </VWindow>
  </div>
</template>
