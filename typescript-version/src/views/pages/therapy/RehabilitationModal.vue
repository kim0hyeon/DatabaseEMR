<script setup lang='ts'>
// Components 일단 환자 정보를 불러와야 하기 때문에 사용함
import axios from 'axios'
import { reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 백엔드에서 환자 정보 받아오기
interface Patient {
  patient_id: string
  patient_name: string
  patient_gender: string
  patient_birth: string
  patient_residence_number: string
  patient_phone_number: string
  patient_emergency_phone_number: string
  patient_address: string
  patient_agree_essential_term: boolean
  patient_agree_optional_term: boolean
}

let patientInformation = ref<Patient[]>([])
const token = sessionStorage.getItem('token')
onMounted(async () => {
  try {
    const response = await axios.get('http://yunsseong.uk:8000/api/patients/', {
      headers: { Authorization: `Token ${token}` },
    })
    patientInformation.value = response.data
    console.log('patient data loding success')
  } catch (error) {
    console.error(error)
  }
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
</script>
<template>
  <VRow>
    <VCol cols="12">
      <VCard class="px-4 py-4">
        <VRow>
          <VCol cols="3">
            <VCard class="px-1 py-1">
              <h2 class="letter-spacing">내원이력</h2>
              <VCard class="visit-history-box">
                <h4 class="letter-spacing"></h4>
                <!--클릭해도 여기가 안바껴 미치겠음 -->
                <div style="padding: 10px">
                  <img
                    src="../../../assets/icons/calendar.png"
                    class="small-icon-size"
                  />
                  <p></p>
                </div>
                <div style="padding: 10px">
                  <img
                    src="../../../assets/icons/record.png"
                    class="small-icon-size"
                  />
                  <p>간단한 진료 목적 ex.재진찰</p>
                </div>
              </VCard>
              <VCard>
                <h4 class="letter-spacing"></h4>
                <div style="padding: 10px">
                  <img
                    src="../../../assets/icons/calendar.png"
                    class="small-icon-size"
                  />
                  <p>과거 방문 날짜</p>
                </div>
                <div style="padding: 10px">
                  <img
                    src="../../../assets/icons/prescription.png"
                    class="small-icon-size"
                  />
                  <p>과거 재활치료 내용</p>
                </div>
                <div style="padding: 10px">
                  <img
                    src="../../../assets/icons/diagnosis.png"
                    class="small-icon-size"
                  />
                  <p>병명</p>
                </div>
              </VCard>
            </VCard>
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
                    <h2>진료기록</h2>
                  </div>
                  <div class="text-box">
                    <p>여기에 진료내용이 입력됩니다!</p>
                    <p>수정은 불가능!</p>
                  </div>
                </VCard>
              </VCol>
              <VCol cols="3">
                <VCard class="px-2 py-2">
                  <div class="letter-spacing">
                    <img
                      src="../../../assets/icons/picture.png"
                      class="large-icon-size"
                    />
                    <h2>사진,영상</h2>
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
                <h2>재활치료</h2>
              </div>
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
      </VCard>
    </VCol>
  </VRow>
</template>
<style>
@use '@core/scss/pages/page-auth.scss';

.text-box {
  padding: 10px;
  border: 1px solid #ccc;
  min-block-size: 100px;
}

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
