<script setup lang="ts">
// Components
import PatientRecord from '@/exampleJson/patient_record.json'
import { IdStore } from '@/store/index'
import { ref } from 'vue'
// 사용자 타입 예시 (백엔드에 따라 수정해야 함)
const store = IdStore()
interface Patient {
  id: number
  name: string
  age: number
  gender: string
  diagnosis: string
}
interface PatientRecord {
  id: number
  patient_id: number
  diagnosis_id: number
  date: string
}
// const patients = reactive<Patient[]>(PatientData.patients)
// console.log(patients);
// console.log(IdStore().id);
// console.log(patients[IdStore().id]);

// let patientId: { id: number; name: string; age: number; gender: string; diagnosis: string; } | undefined;
// patientId = patients[0]; // 변수 선언

// function clickPatient(event: MouseEvent) {
//   patientId = patients.find(patient => patient.id === IdStore().id);

//   if (patientId == null) {
//     patientId = patients.find(patient => patient.id === 1);
//   } else {
//     console.log(patientId);
//   }
// }

// document.documentElement.addEventListener('click', clickPatient);

interface PatientRecordsData {
  patient_records: PatientRecord[]
}
const patientRecord: PatientRecordsData = PatientRecord

const patientInfoRec = ref<PatientRecord | undefined>(undefined)

const getUserInfoByID = () => {
  // Update the value of patientInfo
  patientInfoRec.value = patientRecord.patient_records.filter(patient => patient.patient_id === Number(store.id))

  //가까운 시기로 정렬
  patientInfoRec.value.sort((a, b) => {
    return new Date(b.diagnosis_id) - new Date(a.diagnosis_id)
  })
  // console.log(store.id);
  // console.log(patientInfoRec)
}
watch(
  () => {
    return store.id
  },
  (newId, oldId) => {
    // console.log(`ID changed from ${oldId} to ${newId}`);
    getUserInfoByID()
  },
)
getUserInfoByID()
</script>

<template>
  <VCard class="base">
    <VRow>
      <VCol cols="3">
        <div class="scroll-container pat_list">
          <VCard class="px-1 py-1">
            <h2 class="letter-spacing">내원이력 (이름)</h2>
            <!--나중에 백에서 join해서 쓰면 됌 -->
            <p>(나중에 이름은 백에서 조인해서 쓰면 될듯)</p>
            <VCard
              v-for="patient_rec in patientInfoRec"
              :key="patient_rec.id"
              class="visit-history-box"
            >
              <h4 class="letter-spacing">진료아이디: {{ patient_rec?.id }}</h4>
              <h4 class="letter-spacing">진료날짜: {{ patient_rec?.date }}</h4>
              <h4 class="letter-spacing">병 아이디: {{ patient_rec?.diagnosis_id }}</h4>
              <div style="padding: 10px">
                <img
                  src="../assets/icons/record.png"
                  class="small-icon-size"
                />
                <p>간단한 진료 목적 ex.재진찰</p>
              </div>
            </VCard>
            <!-- <VCard class="visit-history-box">
                  <h4 class="letter-spacing">{{ patientInfoRec?.date }}</h4>
                  <div style="padding: 10px;">
                    <img src="../assets/icons/calendar.png" class="small-icon-size">
                    <p></p>
                  </div>
                  <div style="padding: 10px;">
                    <img src="../assets/icons/record.png" class="small-icon-size">
                  <p>과거 방문 목적</p>
                  </div>
                  <div style="padding: 10px;">
                    <img src="../assets/icons/diagnosis.png" class="small-icon-size">
                    <p>병명</p>
                  </div>
                </VCard>
                <VCard>
                  <h4 class="letter-spacing">{{ patientInfoRec?.diagnosis_id }}</h4>
                  <div style="padding: 10px;">
                    <img src="../assets/icons/calendar.png" class="small-icon-size">
                    <p></p>
                  </div>
                  <div style="padding: 10px;">
                    <img src="../assets/icons/prescription.png" class="small-icon-size">
                    <p>처방or치료내용</p>
                  </div>
                  <div style="padding: 10px;">
                    <img src="../assets/icons/medicine.png" class="small-icon-size">
                    <p>배포약</p>
                  </div>
                </VCard> -->
          </VCard>
        </div>
      </VCol>
      <VCol cols="9">
        <div class="pat_chart">
          <VCol>
            <VRow>
              <VCol cols="9">
                <VCard class="pat_chart px-2 py-2">
                  <div class="letter-spacing">
                    <img
                      src="../assets/icons/stethoscope.png"
                      class="large-icon-size"
                    />
                    <h2>진료기록</h2>
                  </div>
                  <VTextarea
                    label="여기에 입력하세요"
                    outline
                    rows="10"
                    auto-grow
                    style="margin-bottom: 5px"
                  ></VTextarea>
                  <VBtn style="border-radius: 13px; font-size: 15px">저장</VBtn>
                </VCard>
                <VCard class="pat_chart px-2 py-2">
                  <div class="letter-spacing">
                    <img
                      src="../assets/icons/prescription.png"
                      class="large-icon-size"
                    />
                    <h2>진단 및 처방</h2>
                  </div>
                  <VTextarea
                    label="여기에 입력하세요"
                    outline
                    rows="10"
                    auto-grow
                    style="margin-bottom: 5px"
                  ></VTextarea>
                  <VBtn style="border-radius: 13px; font-size: 15px">저장</VBtn>
                </VCard>
              </VCol>
              <VCol cols="3">
                <VCard class="pat_chart px-2 py-2">
                  <div class="letter-spacing">
                    <img
                      src="../assets/icons/picture.png"
                      class="large-icon-size"
                    />
                    <h2>사진</h2>
                  </div>
                  <VFileInput></VFileInput>
                  <!-- <div>
                  <img :src='imgpath.path1' class="upload-img">
                </div> -->
                </VCard>
              </VCol>
            </VRow>
          </VCol>
        </div>
      </VCol>
    </VRow>
  </VCard>
</template>

<style lang="scss">
@use '@core/scss/pages/page-auth.scss';

.base {
  margin: 10px;
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

.pat_list {
  margin: 20px; /* 컨테이너 마진 */
}

.pat_chart {
  margin: 10px; /* 컨테이너 마진 */
}

.scroll-container {
  padding: 10px; /* 패딩 설정 */
  block-size: 95vh;
  overflow-y: auto; /* 높이를 초과하면 y축 스크롤 바 표시 */
}
</style>
