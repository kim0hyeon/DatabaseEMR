<script lang="ts" setup>
import { useTheme } from 'vuetify'

import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import PatientData from '../../exampleJson/patient.json'
// Banner
import { IdStore } from '@/store'
import { watch } from 'vue'
import { useRoute } from 'vue-router'
interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  diagnosis: string;
}
const store = IdStore()
// var patient = PatientData.patients
const vuetifyTheme = useTheme()
const route = useRoute()
const getID = (id) => {
  store.setID(id)
  console.log(store.id)
}
const patients = reactive<Patient[]>(PatientData.patients)
patients.value = PatientData.patients;
const searchTerm: Ref<string> = ref('')
const searchResults = reactive<Patient[]>([])
const selectedPatient = ref<Patient | null>(null)
const searchPatient = (event: Event) => {
  searchTerm.value = (event.target as HTMLInputElement).value;
  if (searchTerm.value) {
    console.log(searchTerm.value)
    searchResults.splice(
      0,
      searchResults.length,
      ...patients.filter((patient) => patient.name.includes(searchTerm.value))
      );
      patients.value = searchResults;
      console.log(patients);
    } else {
      searchResults.splice(0, searchResults.length);
      patients.value = PatientData.patients; // 입력창 비워지면  초기화 
    }
  }

watch(() => {
  return route.path;
},(newP,oldP) => {
console.log(`ID changed from ${oldP} to ${newP}`);
patients.value = PatientData.patients; // 페이지 바뀌면 초기화 
getRoutePath();});
// var str = route.path;
var pathway = route.name// default 값이 dashboard
const getRoutePath = () => {
  // str = route.path
  pathway = route.name
}

</script>

<template>
  <VerticalNavLayout>
    <!-- 실험용 용 -->
    {{ pathway }}
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



        <VSpacer />

        <IconBtn
          class="me-2"
          href="https://github.com/kim0hyeon/DatabaseEMR"
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
              to: '/patient-registration'
            }"
          />

          <VerticalNavLink
            :item="{
              title: '차트',
              icon: 'mdi-chart-bar',
              // icon: 'mdi-login',
              to: '/chart'
            }"
          />
          <VerticalNavLink
            :item="{
              title: '검사',
              icon: 'mdi-test-tube',
              to: '/examination',
            }"
          />
          <VerticalNavLink
            :item="{
              title: '청구',
              icon: 'mdi-credit-card-outline',
              // icon: 'mdi-information-outline',
              // to: '/no-existence',
              to: '/cost',
            }"
          />
          <VerticalNavLink
            :item="{
              title: '물리,재활치료',
              icon: 'mdi-weight-lifter',
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
          <div style="height: 50px;"></div>
          <VerticalNavLink
            :item="{
              title: '로그인',
              icon: 'mdi-login',
              to: '/login',
            }"
          />
          <VerticalNavLink
          :item="{
            title: '회원가입',
              icon: 'mdi-file-sign',
              to: '/register',
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
          <!-- 환자 리스트 -->
          <div class="patList1">
           <!-- 환자 검색 -->
          <VTextField class="patinput" @input="searchPatient" label="환자입력" />
          <div class="patList2" v-for="item in patients.value" :key="item.id" >
            <router-link @click="getID(item.id)" class="patItem" :to="pathway" >{{ item.name }} </router-link>&nbsp;{{ item.gender }}
          </div>
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
.patList1 {
  display: grid;
}

.patList2 {
  align-content: center;
  color: #5b84d4;
  margin-block-start: 30px;
}

.patItem {
  border: thin solid rgba(#3d67ba, var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  color: #5b84d4; // 글자는 좀 주 배경보다 연한 파랑으로
  font-size: 24px;
  line-height: 1.3125rem;
  padding-block: 0.3rem;
  padding-inline: 1rem;
}

.patinput {
  color: #3d67ba;
}

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
