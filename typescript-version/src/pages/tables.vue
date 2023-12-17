<script setup lang="ts">
import { IdStore } from '@/store'
import DemoSimpleTableBasics from '@/views/pages/tables/DemoSimpleTableBasics.vue'
import DemoSimpleTableDensity from '@/views/pages/tables/DemoSimpleTableDensity.vue'
import DemoSimpleTableTheme from '@/views/pages/tables/DemoSimpleTableTheme.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import patientData from '../exampleJson/patient.json'
const store = IdStore()
const token = sessionStorage.getItem('token')

// 결제창 아직 안됌
const requestPay = () => {
  if (window.IMP) {
    window.IMP.init('imp17021862')

    window.IMP.request_pay(
      {
        pg: 'TC0ONETIME', // Test는 TC0ONETIME
        pay_method: 'card',
        merchant_uid: '57008833-33004',
        name: '테스트 상점',
        amount: 1004,
        buyer_email: 'leokang123@naver.com',
        buyer_name: '코드쿡',
        buyer_tel: '010-1234-5678',
        buyer_addr: '서울특별시',
        buyer_postcode: '123-456',
      },
      rsp => {
        // 비동기 요청은 ref를 사용하여 데이터를 업데이트
        if (rsp.imp_uid) {
          // 서버에 결제 완료를 알리고 검증하는 등의 로직 수행
          // 예시로 /verifyIamport API에 imp_uid를 전달하는 POST 요청을 보내고 결과를 받아와 사용
          fetch(`/verifyIamport/${rsp.imp_uid}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
              if (rsp.paid_amount === data.response.amount) {
                alert('결제 성공')
              } else {
                alert('결제 실패')
              }
            })
        }
      },
    )
  } else {
    console.error('IMP 객체를 찾을 수 없습니다.')
    console.log(window.IMP)
  }
}
interface Patient {
  id: number
  name: string
  age: number
  gender: string
  diagnosis: string
}
const route = useRoute()
interface PatientsData {
  patients: Patient[]
}
const patientsData: PatientsData = patientData

const patientInfo = ref<Patient | undefined>(undefined)

const getUserInfoByID = () => {
  // Update the value of patientInfo
  patientInfo.value = patientsData.patients.find(patient => patient.id === Number(store.id))
  console.log(store.id)
}
watch(
  () => {
    return store.id
  },
  (newId, oldId) => {
    console.log(`ID changed from ${oldId} to ${newId}`)
    getUserInfoByID()
  },
)
getUserInfoByID()
</script>
<template>
  <VRow>
    <VCol cols="12">
      <!-- {{ $route }} -->
      {{ patientInfo }}
      <!-- {{ data }} -->
      <VCard :title="patientInfo?.name">
        <DemoSimpleTableBasics v-if="patientInfo?.name" />
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard title="약제비">
        <VCardTex> use <code>theme</code> prop to switch table to the dark theme. </VCardTex>
        <DemoSimpleTableTheme v-if="patientInfo?.name" />
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard title="최종금액">
        <VCardText> You can show a dense version of the table by using the <code>density</code> prop. </VCardText>
        <DemoSimpleTableDensity v-if="patientInfo?.name" />
      </VCard>
      <VBtn
        @click="requestPay"
        class="mt-5 offset-md-11"
      >
        출력
      </VBtn>
    </VCol>

    <!-- <VCol cols="12">
      <VCard title="Height">
        <VCardText>
          You can set the height of the table by using the <code>height</code> prop.
        </VCardText>
        <DemoSimpleTableHeight />
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard title="Fixed Header">
        <VCardText>
          You can fix the header of table by using the <code>fixed-header</code> prop.
        </VCardText>
        <DemoSimpleTableFixedHeader />
      </VCard>
    </VCol> -->
  </VRow>
</template>
