<script setup lang="ts">
// Components
import PatientRecord from '@/exampleJson/patient_record.json'
import MedicalRecord from '@/pages/MedicalRecord.vue'
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

interface Photo {
  url: string
  name: string
}

const photos = ref<Photo[]>([])
const selectedPhoto = ref('')
const clickedSendFile = () => {
  photos.value = []
  alert('저장완료')
}
function handleFilesUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files) {
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = e => {
        if (e.target?.result) {
          const url = e.target.result.toString()
          // 최근 업로드가 위로오도록 unshift사용
          photos.value.unshift({ url, name: file.name })
          selectedPhoto.value = e.target.result.toString()
        }
      }
      reader.readAsDataURL(file)
    })
  }
}

// 사진쪽 클릭하면 뜨게 하고 하는거는 나중에 짜자 그냥 사이트 라우트 되었을떄 디비에서 다 찾아내는 방식으로 짜야 안복잡할듯
// 맘같아선 새창을 띄우고 싶은데 이게 생각처럼 쉽지 않음 store에 있는값을 사용못함 새창을 쓰면
function removePhoto(index: number) {
  photos.value.splice(index, 1)
}
function selectImage(image: Photo) {
  selectedPhoto.value = image.url
}

interface PatientRecordsData {
  patient_records: PatientRecord[]
}
const patientRecord: PatientRecordsData = PatientRecord

const patientInfoRec = ref<PatientRecord | undefined>(undefined)

const getUserInfoByID = () => {
  // Update the value of patientInfo
  patientInfoRec.value = patientRecord.patient_records.filter(patient => patient.patient_id === Number(store.id))

  //가까운 시기로 정렬
  patientInfoRec.value?.sort((a, b) => {
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

// 진단카드, 카드추가, 카드제거
const DiagnosisCards = reactive<number[]>([])
function addDiagnosisCard() {
  DiagnosisCards.push(DiagnosisCards.length + 1)
}
function subDiagnosisCard() {
  DiagnosisCards.pop()
}
// 처방카드, 카드추가, 카드제거
const PrescriptionCards = reactive<number[]>([])
function addPrescriptionCard() {
  PrescriptionCards.push(PrescriptionCards.length + 1)
}
function subPrescriptionCard() {
  PrescriptionCards.pop()
}

// 모달창 구현
const isModalOpen = ref(false)
const openModal = () => {
  console.log('before:',isModalOpen.value)
  isModalOpen.value = true
  console.log('after:',isModalOpen.value)
}
</script>

<template>
  <MedicalRecord v-model="isModalOpen"/>
  <VBtn @click="openModal">상세정보</VBtn>
  <VRow>
    <VCol
      class="pa-0"
      cols="3"
    >
      <div class="pat_list">
        <VCard class="pa-4">
          <h2 class="letter-spacing">(이름)홍길동</h2>
          <p>(나중에 이름은 백에서 조인해서 쓰면 될듯)</p>
          <h3 class="ml-2 mb-4"><b>내원이력</b></h3>
          <div class="scroll-container history">
            <VCard class="px-1 py-1">
              <VCard
                v-for="patient_rec in patientInfoRec"
                :key="patient_rec.id"
                class="visit-history-box ma-1"
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
            </VCard>
          </div>
        </VCard>
      </div>
    </VCol>
    <VCol
      class="pa-0 ma-0"
      cols="9"
    >
      <div
        class="pat_chart"
        style="padding-top: 15px; padding-right: 15px; padding-bottom: 15px"
      >
        <VRow>
          <VCol
            class="pa-0"
            cols="8"
          >
            <VCard class="pat_chart px-2 py-2">
              <div class="letter-spacing">
                <img
                  src="../assets/icons/stethoscope.png"
                  class="large-icon-size"
                />
                <h2>방문사유</h2>
              </div>
              <VTextarea
                readonly
                outline
                rows="2"
                auto-grow
                style="margin-bottom: 5px"
                value="종강을 못참는 병"
              ></VTextarea>
            </VCard>
          </VCol>
          <VCol
            class="pa-0"
            cols="4"
          >
            <VCard class="pat_chart px-2 py-2">
              <div class="letter-spacing">
                <img
                  src="../assets/icons/picture.png"
                  class="large-icon-size"
                />
                <h2>사진</h2>
              </div>
              <label
                for="image"
                class="custom-file-upload1 chart"
              >
                <span>파일 선택</span>
                <input
                  type="file"
                  id="image"
                  @change="handleFilesUpload"
                />
              </label>
              <VBtn
                @click="clickedSendFile"
                class="ml-4 mb-1"
                >저장</VBtn
              >
              <div
                class="scroll-container photo_list"
                v-if="photos.length > 0"
              >
                <div
                  v-for="(photo, index) in photos"
                  :key="photo.name"
                >
                  <VDivider class="ma-3" />
                  <img
                    :src="photo.url"
                    :alt="photo.name"
                    class="sm-image"
                  />
                  <p class="name">{{ photo.name }}</p>

                  <button @click="selectImage(photo)">(overview)</button>
                  &nbsp;
                  <button @click="removePhoto(index)">(remove)</button>
                </div>
              </div>
            </VCard>
          </VCol>
          <VCard class="pat_chart2 pa-2 ma-2">
            <div class="letter-spacing">
              <img
                src="../assets/icons/prescription.png"
                class="large-icon-size"
              />
              <h2>진단</h2>
            </div>
            <VTextarea
              label="진단기록"
              outline
              rows="2"
              auto-grow
              style="margin-bottom: 5px"
            ></VTextarea>
            <VCard
              v-for="(i, index) in DiagnosisCards"
              :key="index"
              class="add-card"
              >추가된 진단입니다.</VCard
            >
            <VBtn style="border-radius: 13px; font-size: 15px">저장</VBtn>
            <VBtn
              style="border-radius: 13px; font-size: 15px"
              @click="addDiagnosisCard"
              class="right-btn"
              >진단 추가</VBtn
            >
            <VBtn
              style="border-radius: 13px; font-size: 15px"
              @click="subDiagnosisCard"
              class="right-btn"
              >진단 제거</VBtn
            >
          </VCard>
          <VCard class="pat_chart2 pa-2 ma-2">
            <div class="letter-spacing">
              <img
                src="../assets/icons/prescription.png"
                class="large-icon-size"
              />
              <h2>처방</h2>
            </div>
            <VTextarea
              label="처방기록"
              outline
              rows="2"
              auto-grow
              style="margin-bottom: 5px"
            ></VTextarea>
            <VCard
              v-for="(i, index) in PrescriptionCards"
              :key="index"
              class="add-card"
              >추가된 치료입니다.</VCard
            >
            <VBtn style="border-radius: 13px; font-size: 15px">저장</VBtn>
            <VBtn
              @click="addPrescriptionCard"
              style="border-radius: 13px; font-size: 15px"
              class="right-btn"
              >처방 추가</VBtn
            >
            <VBtn
              @click="subPrescriptionCard"
              style="border-radius: 13px; font-size: 15px"
              class="right-btn"
              >처방 제거</VBtn
            >
          </VCard>
        </VRow>
      </div>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use '@core/scss/pages/page-auth.scss';

.sm-image {
  max-block-size: 50px;
  max-inline-size: 50px;
}

.photo_list {
  max-block-size: 30vh;
}

.custom-file-upload1 {
  position: relative;
  display: inline-block;
  margin: 5px;
  cursor: pointer;
}

.custom-file-upload1 input[type='file'] {
  display: none;
}

.custom-file-upload1 span {
  border-radius: 5px;
  background-color: #3498db;
  color: #fff;
  padding-block: 9px;
  padding-inline: 11px;
}

.visit-history-box {
  border-block-end: 1px black solid;
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

.pat_chart2 {
  inline-size: 90vh;
}

.scroll-container {
  overflow-y: auto; /* 높이를 초과하면 y축 스크롤 바 표시 */
}

.name {
  overflow: hidden;
  font-size: 18px;
  margin-block-start: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history {
  block-size: 50vh;
}

.letter-spacing .scroll-container {
  border: none;
  overflow-y: auto; /* 높이를 초과하면 y축 스크롤 바 표시 */
}

.title {
  text-align: center;
}

.image {
  block-size: 300px;
}

.add-card {
  margin-block: 10px;
}

.right-btn {
  float: right;
  margin-left: 10px;
}
</style>
