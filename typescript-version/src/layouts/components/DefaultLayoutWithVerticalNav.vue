<script lang="ts" setup>
import { useTheme } from 'vuetify'

import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import upgradeBannerDark from '@images/pro/upgrade-banner-dark.png'
import upgradeBannerLight from '@images/pro/upgrade-banner-light.png'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import PatientData from '../../exampleJson/patient.json'
// Banner
const patient = PatientData.patients
const vuetifyTheme = useTheme()

const upgradeBanner = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? upgradeBannerLight : upgradeBannerDark
})


</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="mdi-menu" />
        </IconBtn>

        <!-- 👉 Search -->
          <div
            class="d-flex align-center cursor-pointer"
            style="user-select: none;"
          >
          <!-- 👉 Search Trigger button -->
          <IconBtn>
            <VIcon icon="mdi-magnify" />
          </IconBtn>

          <span class="d-none d-md-flex align-center text-disabled">
            <span class="me-3">Search</span>
            <span class="meta-key">&#8984;K</span>
          </span>
        </div>

        <VSpacer />

        <IconBtn
          class="me-2"
          href="https://github.com/themeselection/materio-vuetify-vuejs-admin-template-free"
          target="_blank"
          rel="noopener noreferrer"
        >
          <VIcon icon="mdi-github" />
        </IconBtn>

        <IconBtn class="me-2">
          <VIcon icon="mdi-bell-outline" />
        </IconBtn>

        <NavbarThemeSwitcher class="me-2" />

        <UserProfile />
      </div>
    </template>

    <template #vertical-nav-content>
      <div id="nav-container">
        <div id="nav-group-1">
          <!-- 👉 User Interface -->
          <VerticalNavSectionTitle
            :item="{
              heading: '메뉴',
            }"
          />
          <VerticalNavLink
            :item="{
              title: '홈',
              icon: 'mdi-home-outline',
              to: '/dashboard',
            }"
          />
          <VerticalNavLink
            :item="{
              title: '접수',
              icon: 'mdi-account-plus-outline',
              // icon: 'mdi-account-cog-outline',
              to: '/account-settings',
            }"
          />

          <VerticalNavLink
            :item="{
              title: '차트',
              icon: 'mdi-form-select',
              // icon: 'mdi-login',
              to: '/login'
            }"
          />
          <VerticalNavLink
            :item="{
              title: '검사',
              // icon: 'mdi-account-plus-outline',
              to: '/register',
            }"
          />
          <VerticalNavLink
            :item="{
              title: '청구',
              icon: 'mdi-credit-card-outline',
              // icon: 'mdi-information-outline',
              // to: '/no-existence',
              to: '/tables',
            }"
          />
          <VerticalNavLink
            :item="{
              title: '물리,재활치료',
              icon: 'mdi-form-select',
              to: '/physiotherapy',
            }"
          />
          <VerticalNavLink
            :item="{
              title: '통계',
              icon: 'mdi-form-select',
              to: '/statistics',
            }"
          />
        </div>
        
        <div id="nav-group-2">
          <!-- 👉 User Interface -->
          <VerticalNavSectionTitle
            :item="{
              heading: '환자 리스트',
            }"
          />
         
          <div v-for="item in patient" :key="item.id" >
            <router-link :to="{name:'tables-detail', params:{id: item.id}}" >{{ item.name }}</router-link>

            <!-- <VerticalNavLink 
              :item="{
                title: item.name,
                icon: 'mdi-alpha-t-box-outline',
              }"
            /> -->
        </div>
          
          <!-- <VTable>
    <thead>
      <tr>
        <th class="text-uppercase">
          name
        </th>
        <th class="text-uppercase text-center">
          gender
        </th>
      </tr>
    </thead>

    <tbody>
        <tr
        v-for="item in patient"
        :key="item.id"
      >
        <td>
          {{ item.name }}
        </td>
        <td class="text-center">
          {{ item.gender }}
        </td>

    </tr>
  </tbody>
  </VTable> -->
        </div>
      </div>
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}

#nav-container {
  display: flex;
}

#nav-group-1,
#nav-group-2 {
  flex: 1;
}
</style>
