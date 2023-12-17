<script setup lang="ts">
// Components
import { Reception, Chart, Inspect, Disease, Treatment, Medication, Photo } from "@/pages/interfaces";
import MedicalRecord from '@/pages/MedicalRecord.vue'
import Scan from '@/pages/Scan.vue'
import SelectInspection from '@/pages/selectInspection.vue'
import SelectMedication from '@/pages/selectMedication.vue'
import SelectDisease from "@/pages/selectDisease.vue";
import SelectTreatment from "@/pages/selectTreatment.vue";
import { IdStore } from '@/store/index'
import axios from 'axios'
import { ref } from 'vue'
import { useStore } from 'vuex'

const store = IdStore()
const token = sessionStorage.getItem('token')

const photo = ref<Photo>()
const selectedPhoto = ref('')

function handleFilesUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files ? target.files[0] : null

  if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        if (e.target?.result) {
          const url = e.target.result.toString()
          photo.value = { url, name: file.name }
          selectedPhoto.value = url
          console.log(photo.value)
        }
      }
    reader.readAsDataURL(file)
  }
}

/*
// 사진쪽 클릭하면 뜨게 하고 하는거는 나중에 짜자 그냥 사이트 라우트 되었을떄 디비에서 다 찾아내는 방식으로 짜야 안복잡할듯
// 맘같아선 새창을 띄우고 싶은데 이게 생각처럼 쉽지 않음 store에 있는값을 사용못함 새창을 쓰면
function removePhoto(index: number) {
  photos.value.splice(index, 1)
}
function selectImage(image: Photo) {
  selectedPhoto.value = image.url
}
*/
// 백엔드에서 접수 정보, 차트 정보 받아오기
let receptionInfo = ref<Reception>()
let chartInfo = ref<Chart[]>([])

const getReceptionInfo = async (id: string) => {
  try {
    console.log(id)
    const response = await axios.get(`http://yunsseong.uk:8000/api/receptions?patient=${id}`, {
      headers: { Authorization: `Token ${token}` },
    })
    receptionInfo.value = response.data[0]
    console.log(receptionInfo.value)
  } catch (error) {
    console.error(error)
  }
}

const getChartInfo = async (id: string) => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/chart?patient=${id}`, {
      headers: { Authorization: `Token ${token}` },
    })
    chartInfo.value = response.data

    chartInfo.value = response.data.map((item: Chart) => {
      return {
        ...item,
        date_only: item.datetime.split('T')[0],
      }
    })

    return chartInfo.value
  } catch (error) {
    console.error(error)
  }
}

watch(
  () => {
    return store.id
  },
  async (newId, oldId) => {
    console.log(`ID changed from ${oldId} to ${newId}`)
    await getReceptionInfo(newId)
    await getChartInfo(newId)
  },
)

// 백엔드에서 검사, 질병, 치료, 처방 정보 받아오기
let inspectList = ref<Inspect[]>([])
let diseaseList = ref<Disease[]>([])
let treatmentList = ref<Treatment[]>([])
let medicationList = ref<Medication[]>([])

onMounted(async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/inspect_type/`, {
      headers: { Authorization: `Token ${token}` },
    })
    inspectList.value = response.data
    console.log('inspectList loading success')
  } catch (error) {
    console.error(error)
  }
})

onMounted(async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/disease/`, {
      headers: { Authorization: `Token ${token}` },
    })
    diseaseList.value = response.data
    console.log('diseaseList loading success')
  } catch (error) {
    console.error(error)
  }
})

onMounted(async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/treatment/`, {
      headers: { Authorization: `Token ${token}` },
    })
    treatmentList.value = response.data
    console.log('treatmentList loading success')
  } catch (error) {
    console.error(error)
  }
})

onMounted(async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/medication/`, {
      headers: { Authorization: `Token ${token}` },
    })
    medicationList.value = response.data
    console.log('medicationList loading success')
  } catch (error) {
    console.error(error)
  }
})

// 모달창 구현
// 진료기록 모달
let selectedChartId = ref('')
let selectedReceptionId = ref('')
const isRecordOpen = ref(false)
const openRecord = (chart_id: string, reception_id: string) => {
  console.log(reception_id)
  isRecordOpen.value = true
  selectedChartId.value = chart_id
  selectedReceptionId.value = reception_id
}

// 검사목록 모달
const isInspectionListOpen = ref(false)

const openInspectionList = () => {
  isInspectionListOpen.value = true
}

// 질병목록 모달
const isDiseaseListOpen = ref(false)

const openDiseaseList = () => {
  isDiseaseListOpen.value = true
}

// 치료목록 모달
const isTreatmentListOpen = ref(false)

const openTreatmentList = () => {
  isTreatmentListOpen.value = true
}

// 처방목록 모달
const isMedicationListOpen = ref(false)
const openMedication = () => {
  isMedicationListOpen.value = true
}

const chartStore = useStore()

const selectedInspection = computed(() => chartStore.getters.selectedInspection)
const selectedDisease = computed(() => chartStore.getters.selectedDisease)
const selectedTreatment = computed(() => chartStore.getters.selectedTreatment)
const selectedMedication = computed(() => chartStore.getters.selectedMedication)

// 스캔 모달
const isScanOpen = ref(false)
const OpenScanning = () => {
  console.log(isScanOpen.value)
  isScanOpen.value = true
  console.log(isScanOpen.value)
}

// 백엔드에 chart 정보 전송
const patientDiagnosis = ref('')

const postChart = async () => {
  try {
    console.log(inspectList.value)
    const data = {
      diagnosis: patientDiagnosis.value,
      doctor_opinion: '',
      image_url: photo.value?.url,
      patient: store.id,
      inspect: selectedInspection.value,
      disease: selectedDisease.value,
      treatment: selectedTreatment.value,
      medication: selectedMedication.value
    }

    console.log(data)

    const response = await axios.post(`http://yunsseong.uk:8000/api/chart/`, data, {
      headers: { Authorization: `Token ${token}` },
    })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <VRow>
    <VCol
      class="pa-0"
      cols="3"
    >
      <div class="pat_list">
        <VCard class="pa-4">
          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <h3 class="letter-spacing">{{ receptionInfo?.patient.patient_name ?? '이름' }}</h3>
            </VCol>
            <VCol
              cols="12"
              md="6"
              class="mt-1"
            >
              <Scan v-model="isScanOpen" />
              <VBtn
                @click="OpenScanning"
                class="right-btn"
                >Scan</VBtn>
            </VCol>
          </VRow>
          <VDivider />

          <h3 class="mt-4 ml-2 mb-4"><b>내원이력</b></h3>
          <div class="scroll-container history">
            <VCard class="px-1 py-1">
              <MedicalRecord
                v-model="isRecordOpen"
                :chart_id="selectedChartId"
                :reception_id="selectedReceptionId"
              />
              <VCard
                v-if="chartInfo"
                v-for="item in chartInfo"
                :key="item.chart_id"
                class="visit-history-box ma-1"
                @click="openRecord(item.chart_id, receptionInfo?.reception_id)"
              >
                <h4 class="letter-spacing">진료날짜: {{ item.date_only }}</h4>
                <h4 class="letter-spacing">병 아이디: {{ item.disease }}</h4>
                <h4 class="letter-spacing">진단: {{ item.diagnosis }}</h4>
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
            <VCard
              class="pat_chart px-2 py-2"
              style="height: 90%"
            >
              <div class="letter-spacing">
                <img
                  src="../assets/icons/stethoscope.png"
                  class="large-icon-size"
                />
                <h2>방문사유</h2>
              </div>
              <VCardText
                readonly
                outline
                rows="2"
                auto-grow
                style="border: 1px solid; border-radius: 5px"
                class="ml-2 mr-2 cardText"
                >{{ receptionInfo?.visit_reason }}</VCardText
              >
            </VCard>
          </VCol>
          <VCol
            class="pa-0"
            cols="4"
          >
            <VCard
              class="pat_chart px-2 py-2"
              style="height: 90%"
            >
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
                class="ml-4 mb-1"
                >저장</VBtn
              >
              <div
                class="scroll-container photo_list"
                v-if="photo"
              >
                <div>
                  <VDivider class="ma-3" />
                  <img
                    :src="photo?.url"
                    :alt="photo?.name"
                    class="sm-image"
                  />
                  <p class="name">{{ photo?.name }}</p>

                  <button>(overview)</button>
                  &nbsp;
                  <button>(remove)</button>
                </div>
              </div>
            </VCard>
          </VCol>
        </VRow>

        <!-- 진단 -->
        <VRow>
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
              v-model="patientDiagnosis"
            ></VTextarea>
          </VCard>
        </VRow>

        <!-- 검사 -->
        <VRow>
          <VCard class="pat_chart2 pa-2 ma-2">
            <div class="letter-spacing">
              <img
                src="../assets/icons/prescription.png"
                class="large-icon-size"
              />
              <h2>검사</h2>
            </div>

            <VDivider />

            <VRow>
              <VCardText class="pt-2 table-container">
                <table class="list_table">
                  <thead>
                  <tr>
                    <th>검사 ID</th>
                    <th>검사 종류</th>
                    <th>검사 비용</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                    v-for="(item, index) in selectedInspection"
                    :key="index"
                  >
                    <template v-if="item">
                      <td>{{ item.inspect_type_id }}</td>
                      <td>{{ item.inspect_type }}</td>
                      <td>{{ item.inspect_cost }}</td>
                    </template>
                  </tr>
                  </tbody>
                </table>
              </VCardText>
            </VRow>

            <SelectInspection v-model="isInspectionListOpen" />
            <VBtn
              @click="openInspectionList"
              class="right-btn"
              >검사 추가</VBtn>
          </VCard>
        </VRow>

        <!-- 진단 병명 -->
        <VRow>
          <VCard class="pat_chart2 pa-2 ma-2">
            <div class="letter-spacing">
              <img
                src="../assets/icons/prescription.png"
                class="large-icon-size"
              />
              <h2>진단 병명</h2>
            </div>

            <VDivider class="mb-2" />

            <VRow>
              <VCardText class="pt-2 table-container">
                <table class="list_table">
                  <thead>
                  <tr>
                    <th>질병 ID</th>
                    <th>질병 코드</th>
                    <th>질병 이름</th>
                    <th>질병 상세</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                    v-for="(item, index) in selectedDisease"
                    :key="index"
                  >
                    <template v-if="item">
                      <td>{{ item.id }}</td>
                      <td>{{ item.disease_code }}</td>
                      <td>{{ item.disease_name }}</td>
                      <td>{{ item.disease_description }}</td>
                    </template>
                  </tr>
                  </tbody>
                </table>
              </VCardText>
            </VRow>

            <SelectDisease v-model="isDiseaseListOpen" />
            <VBtn
              @click="openDiseaseList"
              class="right-btn"
            >질병 추가</VBtn>
          </VCard>
        </VRow>

        <!-- 치료 -->
        <VRow>
          <VCard class="pat_chart2 pa-2 ma-2">
            <div class="letter-spacing">
              <img
                src="../assets/icons/prescription.png"
                class="large-icon-size"
              />
              <h2>치료</h2>
            </div>

            <VDivider class="mb-2" />

            <VRow>
              <VCardText class="pt-2 table-container">
                <table class="list_table">
                  <thead>
                  <tr>
                    <th>치료 코드</th>
                    <th>치료 이름</th>
                    <th>치료 비용</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                    v-for="(item, index) in selectedTreatment"
                    :key="index"
                  >
                    <template v-if="item">
                      <td>{{ item.treatment_code }}</td>
                      <td>{{ item.treatment_name }}</td>
                      <td>{{ item.treatment_cost }}</td>
                    </template>
                  </tr>
                  </tbody>
                </table>
              </VCardText>
            </VRow>

            <SelectTreatment v-model="isTreatmentListOpen" />
            <VBtn
              @click="openTreatmentList"
              class="right-btn"
            >치료 추가</VBtn>
          </VCard>
        </VRow>

        <!-- 약물 처방 -->
        <VRow>
          <VCard class="pat_chart2 pa-2 ma-2">
            <div class="letter-spacing">
              <img
                src="../assets/icons/prescription.png"
                class="large-icon-size"
              />
              <h2>처방</h2>
            </div>

            <VDivider />
            <VRow>
              <VCardText class="pt-2 table-container">
                <table class="list_table">
                  <thead>
                  <tr>
                    <th>약품 코드</th>
                    <th>약품 이름</th>
                    <th>약품 유형</th>
                    <th>약품 설명</th>
                    <th>복용 방법</th>
                    <th>약품 비용</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                    v-for="(item, index) in selectedMedication"
                    :key="index"
                  >
                    <template v-if="item">
                      <td>{{ item.medication_code }}</td>
                      <td>{{ item.medication_name }}</td>
                      <td>{{ item.medication_type }}</td>
                      <td>{{ item.medication_description }}</td>
                      <td>{{ item.administration_method }}</td>
                      <td>{{ item.medication_cost }}</td>
                    </template>
                  </tr>
                  </tbody>
                </table>
              </VCardText>
            </VRow>

            <SelectMedication v-model="isMedicationListOpen" />
            <VBtn
              @click="openMedication"
              class="right-btn"
              >약품 추가</VBtn
            >
          </VCard>
        </VRow>
        <VRow>
          <VCol>
            <VBtn class="right-btn" @click="postChart">저장</VBtn>
          </VCol>
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
  float: inline-end;
  margin-inline-start: 10px;
}

.list_table {
  border-collapse: separate; /* 셀 경계를 분리합니다. */
  border-spacing: 10px; /* 원하는 간격으로 설정합니다. */
  color: black;
  inline-size: 100%;
}

/* 예시 스타일 */
.list_table th,
.list_table td {
  padding: 10px; /* 셀 안의 내용과 경계 사이의 여백을 조절합니다. */
  text-align: center;
}

.list_table th {
  font-size: 15px;
}

.cardText {
  border-color: gray;
}
</style>
