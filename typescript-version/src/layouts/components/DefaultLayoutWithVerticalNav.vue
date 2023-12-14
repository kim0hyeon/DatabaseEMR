<script lang="ts" setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import { useUserStore } from '@/store'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
import { useTheme } from 'vuetify'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import { IdStore } from '@/store'
import axios from 'axios'
import { watch } from 'vue'
import { useRoute } from 'vue-router'
// 접수환자 리스트 ( 고정 )
interface PatientInfo {
    patient_id: string
    patient_name: string
}

const store = IdStore()
// var patient = PatientData.patients
const vuetifyTheme = useTheme()
const route = useRoute()
const getID = (id) => {
  store.setID(id)
  console.log(store.id)
}

let responseData = null
const patients = ref<PatientInfo[]>([])

onMounted( async () => {
  try {
    // Axios를 사용하여 백엔드로 GET 요청 보내기
    const response = await axios.get('http://yunsseong.uk:8000/api/list/')

    // 받아온 데이터를 responseData에 저장
    patients.value = response.data
    console.log(patients.value)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})

const searchTerm: Ref<string> = ref('')
const searchResults = reactive<PatientInfo[]>([])
const selectedPatient = ref<PatientInfo | null>(null)
const searchPatient = (event: Event) => {
  searchTerm.value = (event.target as HTMLInputElement).value
  if (searchTerm.value) {
    // console.log(searchTerm.value)
    searchResults.splice(
      0,
      searchResults.length,
      ...patients.value.filter(patient => patient.patient_name.includes(searchTerm.value)),
    )
    console.log(patients.value[0].patient_name)
    console.log(searchResults)
    patients.value = searchResults
    // console.log(patients);
  } else {
    searchResults.splice(0, searchResults.length)
    patients.value = responseData // 입력창 비워지면  초기화
  }
}

watch(
  () => {
    return route.path
  },
  (newP, oldP) => {
    console.log(`route changed from ${oldP} to ${newP}`)
    patients.value = responseData // 페이지 바뀌면 초기화
    getRoutePath()
  },
)
// var str = route.path;
var pathway = route.name // default 값이 dashboard
const getRoutePath = () => {
  // str = route.path
  pathway = route.name
}

const userInfo = useUserStore().$state.userInfo
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
        <!-- 메뉴 -->
        <div id="nav-group-1">
          <VerticalNavSectionTitle
            :item="{
              heading: '메뉴',
            }"
          />
          <VerticalNavLink
            :item="{
              title: '홈',
              icon: 'mdi-home-outline',
              to: '/home',
            }"
          />
          <VerticalNavLink
            :item="{
              title: '접수',
              icon: 'mdi-account-plus-outline',
              to: '/patient-registration',
            }"
          />

          <VerticalNavLink
            :item="{
              title: '차트',
              icon: 'mdi-chart-bar',
              to: '/chart',
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
          <VerticalNavLink
            :item="{
              title: '예약',
              icon: 'mdi-calendar-month-outline',
              to: '/reservation',
            }"
          />
          <div style="height: 200px" />
          <VerticalNavSectionTitle :item="{ heading: '관리자 메뉴' }" />
          <VerticalNavLink
            v-if="userInfo.job == 10210"
            :item="{
              title: '이용자 관리',
              icon: 'mdi-account-cog',
              to: '/admin',
            }"
          />
        </div>

        <!-- 환자 리스트 -->
        <div id="nav-group-2">
          <VerticalNavSectionTitle
            :item="{
              heading: '환자 리스트',
            }"
          />
          <!-- 환자 리스트 -->
          <div class="patList1">
            <!-- 환자 검색 -->
            <VTextField
              class="patinput"
              @input="searchPatient"
              label="환자입력"
            />
            <div
              class="patList2"
              :style="{
                opacity: item.id === store.id ? 1.0 : 0.3,
              }"
              v-for="item in patients"
              :key="item.patient_name"
            >
              <router-link
                @click="getID(item.id)"
                active-class="patItem"
                :to="pathway"
                >{{ item.patient_name }} </router-link
              >
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 👉 Pages -->
    <slot class="main" />

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
  color: #3e64b0; // 글자는 좀 주 배경보다 연한 파랑으로
  font-size: 24px;
  line-height: 1.3125rem;
  padding-block: 0.3rem;
  padding-inline: 1rem;
}

.patItem.active::before {
  color: red;
}

.patItem.active::after {
  color: blue;
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
