<script lang="ts" setup>
// 모달창 구현
import {is} from "quasar";
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

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])

let isOpen = ref(props.modelValue)
const closeModal = () => {
  isOpen.value = false
}

watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal
}, { immediate: true })

watch(() => isOpen.value, (newVal) => {
  if (props.modelValue !== newVal) {
    emit('update:modelValue', newVal)
  }
})
</script>

<template>
  <VDialog v-model="isOpen" style="max-width: 1200px;">
    <VCard class="pa-2">
      <VRow>
        <VCol
            cols="4"
            style="height: 100%"
        >
          <div>
            <h2 class="letter-spacing" style="text-align: center">(이름)홍길동</h2>
            <VCardText>
              내원 이력
            </VCardText>
            <VCardText>
              방문 사유
            </VCardText>
          </div>
        </VCol>
        <VCol
            style="height: 100%"
            cols="8"
            class="pb-0"
        >
          <VCard class="pat_chart px-2 py-2"
          style="height: 220px;">
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
                style="margin-bottom: 5px; height: 100%;"
                value="종강을 못참는 병"
            ></VTextarea>
          </VCard>
        </VCol>
      </VRow>
      <VRow>
        <VCol
            class="pa-0 ma-0"
            cols="8"
        >
          <div
              class="pat_chart"
          >
            <VRow>
              <VCol cols="12">
                <VCard class="pat_chart2 pa-2 ma-2"
                       style="width: 100%; height: 100%;">
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
                </VCard>
              </VCol>

              <VCol cols="12">
                <VCard class="pat_chart2 pa-2 ma-2"
                  style="width: 100%; height: 100%;">
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
                </VCard>
              </VCol>

            </VRow>
          </div>
        </VCol>
        <VCol
            cols="4"
        >
          <VCard class="pat_chart px-2 py-2"
          style="height: 100%">
            <div class="letter-spacing">
              <img
                  src="../assets/icons/picture.png"
                  class="large-icon-size"
              />
              <h2>사진</h2>
            </div>
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
      </VRow>
      <VRow>
        <VCol class="text-end">
          <VBtn class="ma-2" @click="closeModal">닫기</VBtn>
        </VCol>
      </VRow>
    </VCard>
  </VDialog>
</template>
