<script setup lang="ts">
import { useUserStore } from '@/store'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const loginStore = useUserStore()
const router = useRouter()
const totalProfit = {
  title: 'Total Profit',
  color: 'secondary',
  icon: 'mdi-poll',
  stats: '$25.6k',
  change: 42,
  subtitle: 'Weekly Project',
}
const token = sessionStorage.getItem('token')

const newProject = {
  title: 'New Project',
  color: 'primary',
  icon: 'mdi-briefcase-variant-outline',
  stats: '862',
  change: -18,
  subtitle: 'Yearly Project',
}

const foo = sessionStorage.getItem('token.ts')

const foo1 = loginStore.$state.userInfo?.name
const foo2 = loginStore.$state.userInfo?.job

const sir = loginStore.$state.userInfo?.name

//현재 시간 불러오기
let now = new Date()
console.log(now)
const year = ref(0)
const month = ref('')
const date = ref('')
const hours = ref('')
const minutes = ref('')
const seconds = ref('')
const dayOfWeek = ref('')

const updateTime = () => {
  now = new Date()
  year.value = now.getFullYear() // 연도
  month.value = String(now.getMonth() + 1) // 월 (+1을 해야 실제 월을 얻을 수 있습니다)
  date.value = String(now.getDate()) // 일
  hours.value = String(now.getHours()).padStart(2, '0') // 시간
  minutes.value = String(now.getMinutes()).padStart(2, '0') // 분
  seconds.value = String(now.getSeconds()).padStart(2, '0') // 초
  dayOfWeek.value = String(now.getDay()) //요일
}
let intervalID = updateTime()
onMounted(() => {
  intervalID = setInterval(updateTime, 1000)
})

let dayName: string = ''
switch (dayOfWeek.value) {
  case '0':
    dayName = '일요일'
    break
  case '1':
    dayName = '월요일'
    break
  case '2':
    dayName = '화요일'
    break
  case '3':
    dayName = '수요일'
    break
  case '4':
    dayName = '목요일'
    break
  case '5':
    dayName = '금요일'
    break
  case '6':
    dayName = '토요일'
    break
  default:
    dayName = '요일을 알 수 없음'
    break
}

console.log(`오늘은 ${dayName}입니다.`)

const userInfo = loginStore.$state.userInfo
</script>
<template>
  <!-- {{ foo }}
  {{ foo1 }}
  {{ foo2 }} -->
  <!-- 시간, 공지사항 -->
  <div class="container">
    <div class="box">
      <p class="date-font">{{ year }}년 {{ month }}월 {{ date }}일 {{ dayName }}</p>

      <p class="time-font">
        {{ hours }}<span class="timefont">시</span> {{ minutes }}<span class="timefont">분</span>
        <span class="seconds">{{ seconds }}초</span>
      </p>
      <p class="man-font">{{ sir }} 선생님,</p>
      <p class="welcome-font">오늘 하루도 화이팅하세요</p>

      <!-- bg img -->
      <VImg
        style="width: 100% position: absolute"
        class="auth-footer-mask d-none d-md-block"
        :src="authThemeMask"
      />
    </div>
    <div
      class="box"
      style="margin-top: 30px"
    >
      <VRow>
        <p style="color: dodgerblue; font-weight: bold; font-size: 40px">공지사항</p>

        <VSpacer />
        <VBtn
          v-if="userInfo?.job == 10210"
          class="mt-4 mr-6 pl-0 pr-0"
          >+</VBtn
        >
      </VRow>

      <VDivider />
      <ul class="alert-list-font">
        <li>현재 입원중인 환자가 많아 입원이 불가능합니다1</li>
        <li>현재 입원중인 환자가 많아 입원이 불가능합니다2</li>
        <li>현재 입원중인 환자가 많아 입원이 불가능합니다3</li>
        <li>현재 입원중인 환자가 많아 입원이 불가능합니다4</li>
        <li>현재 입원중인 환자가 많아 입원이 불가능합니다5</li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
.home-container {
  width: 100%;
  height: auto;
}
.bottom-aligned-image {
  position: absolute;
  bottom: 0;
  width: 20%;
}
.date-font {
  margin-left: 30px;
  margin-top: 30px;
  font-weight: normal;
  font-size: 15px;
  color: dodgerblue;
}
.time-font {
  margin-left: 30px;
  margin-bottom: 30px;
  font-weight: bold;
  font-size: 60px;
  color: dodgerblue;
}
.man-font {
  margin-left: 30px;
  margin-top: 30px;
  font-weight: 500;
  font-size: 20px;
  color: black;
}
.welcome-font {
  font-size: 20px;
  font-weight: 600;
  margin-left: 30px;
  color: black;
}
.container {
  display: flex;
  padding-right: 30px;
}
.box {
  width: 50%;
}
.alert-list-font li {
  font-size: 20px;
  font-weight: 700;
  color: dimgray;
  margin-left: 20px;
  margin-top: 30px;
}
.seconds {
  font-size: 20px;
}
.timefont {
  font-size: 30px;
  margin: 10px;
}
</style>
