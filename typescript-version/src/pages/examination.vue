<script lang="ts" setup>
import AccountSettingsAccount from '@/views/pages/account-settings/AccountSettingsAccount.vue'
import AccountSettingsNotification from '@/views/pages/account-settings/AccountSettingsNotification.vue'
import AccountSettingsSecurity from '@/views/pages/account-settings/BloodExamination.vue'
import Scan from '@/pages/Scan.vue'
import { useRoute } from 'vue-router'
import { is } from 'quasar'

const route = useRoute()

const activeTab = ref(route.params.tab)

// tabs
const tabs = [
  { title: 'Medical Imaging', icon: 'mdi-camera', tab: 'image' },
  { title: 'Blood', icon: 'mdi-water', tab: 'blood' },
  { title: 'Inbody', icon: 'mdi-gymnastics', tab: 'physical' },
]

// 모달창 구현
const isScanOpen = ref(false)
const openScan = () => {
  console.log(isScanOpen.value)
  isScanOpen.value = true
  console.log(isScanOpen.value)
}
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

      <VSpacer />

      <Scan v-model="isScanOpen" />
      <VBtn @click="openScan">Scan</VBtn>
    </VTabs>
    <VDivider />
    <VWindow
      v-model="activeTab"
      class="mt-5 disable-tab-transition"
    >
      <!-- Account -->
      <VWindowItem value="image">
        <AccountSettingsAccount />
      </VWindowItem>

      <!-- Security -->
      <VWindowItem value="blood">
        <AccountSettingsSecurity />
      </VWindowItem>

      <!-- Notification -->
      <VWindowItem value="physical">
        <AccountSettingsNotification />
      </VWindowItem>
    </VWindow>
  </div>
</template>
