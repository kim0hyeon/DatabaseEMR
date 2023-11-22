<script lang="ts" setup>
import { useTheme } from 'vuetify'

import upgradeBannerDark from '@images/pro/upgrade-banner-dark.png'
import upgradeBannerLight from '@images/pro/upgrade-banner-light.png'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'

// Banner

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
              to: '/no-existence',
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
          <VerticalNavLink
            :item="{
              title: 'Typography',
              icon: 'mdi-alpha-t-box-outline',
              to: '/typography',
            }"
          />
          <VerticalNavLink
            :item="{
              title: 'Icons',
              icon: 'mdi-eye-outline',
              to: '/icons',
            }"
          />
          <VerticalNavLink
            :item="{
              title: 'Cards',
              icon: 'mdi-credit-card-outline',
              to: '/cards',
            }"
          />
          <VerticalNavLink
            :item="{
              title: 'Tables',
              icon: 'mdi-table',
              to: '/tables',
            }"
          />
          <VerticalNavLink
            :item="{
              title: 'Form Layouts',
              icon: 'mdi-form-select',
              to: '/form-layouts',
            }"
          />
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
  flex: 1
}
</style>
