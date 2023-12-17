<script lang="ts" setup>
// 모달창 구현
import { IdStore } from '@/store/index'
import { token } from '@/token'
import axios from 'axios'
import { ref } from 'vue'
// 사용자 타입 예시 (백엔드에 따라 수정해야 함)
const store = IdStore()

interface Reception {
  reception: string
  visit_reason: string
  reception_date: string
  reception_date_only: string
  patient: {
    patient_id: string
    patient_name: string
    patient_gender: string
  }
}

interface Chart {
  chart_id: string
  diagnosis: string
  datetime: string
  date_only: string
  image_id: string
  image_url: string
  patient: {
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
  medical: {
    medical_person_id: string
    medical_person_name: string
    medical_person_system_id: string
    medical_person_gender: string
    medical_person_birthday: string
    medical_person_phone_number: string
    medical_person_main_address: string
    medical_person_license: string
    classification_code: string
  }
  inspect: []
  disease: []
  treatment: []
  medication: []
}

interface Photo {
  url: string
  id: string
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

// 백엔드에서 환자 정보 받아오기
let receptionInfo = ref<Reception>()
let chartInfo = ref<Chart>()

const getReceptionInfo = async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/receptions?id=${props.reception_id}`, {
      headers: { Authorization: `Token ${token.value}` },
    })
    receptionInfo.value = response.data[0]
    console.log('reception data loding success')
  } catch (error) {
    console.error(error)
  }
}

const getChartInfo = async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/chart?chart_id=${props.chart_id}`, {
      headers: { Authorization: `Token ${token.value}` },
    })
    chartInfo.value = response.data[0]
    console.log('chart data loading success')
  } catch (error) {
    console.error(error)
  }
}

// 모달창 구현
const props = defineProps({
  modelValue: Boolean,
  chart_id: String,
  reception_id: String,
})

const emit = defineEmits(['update:modelValue'])

let isOpen = ref(props.modelValue)
const closeModal = () => {
  isOpen.value = false
}

watch(
  () => props.modelValue,
  newVal => {
    isOpen.value = newVal
    console.log('load data')
    getChartInfo()
    console.log(chartInfo)
    getReceptionInfo()
    console.log(receptionInfo.value)
  },
  { immediate: true },
)

watch(
  () => isOpen.value,
  newVal => {
    if (props.modelValue !== newVal) {
      emit('update:modelValue', newVal)
    }
  },
)
</script>

<template>
  <VDialog
    v-model="isOpen"
    style="max-width: 1200px"
  >
    <VCard class="pa-2">
      <VRow>
        <VCol
          cols="2"
          style="height: 100%"
        >
          <div>
            <h2
              class="letter-spacing"
              style="text-align: center"
            >
              {{ receptionInfo?.patient.patient_name }}
            </h2>
            <VCardText> 방문 날짜: {{ receptionInfo?.reception_date }} </VCardText>
          </div>
        </VCol>
        <VCol
          style="height: 100%"
          cols="6"
          class="pb-0 pr-0 pl-0"
        >
          <VCard
            class="pat_chart px-2 py-2"
            style="height: 220px"
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
              style="height: 70%; border: 1px solid; border-radius: 5px"
              class="ml-2 mr-2 cardText"
              >{{ receptionInfo?.visit_reason }}</VCardText
            >
          </VCard>
        </VCol>

        <VCol
          cols="4"
          class="pr-5 pl-0"
        >
          <VCard
            class="pat_chart px-2 py-2"
            style="height: 96%"
          >
            <div class="letter-spacing">
              <img
                src="../assets/icons/picture.png"
                class="large-icon-size"
              />
              <h2>사진</h2>
            </div>
            <div class="text-center">
              <img
                :src="chartInfo?.image_url"
                :alt="chartInfo?.image_id"
                style="width: 40%; height: 40%"
              />
            </div>
            <p class="name">{{ chartInfo?.image_id }}</p>
          </VCard>
        </VCol>
      </VRow>
      <VRow>
        <div
          class="pat_chart ml-6"
          style="width: 100%"
        >
          <!-- 진단 -->
          <VRow style="width: 100%">
            <VCard
              class="pat_chart2 pa-2 ma-2"
              style="width: 100%"
            >
              <div class="letter-spacing">
                <img
                  src="../assets/icons/prescription.png"
                  class="large-icon-size"
                />
                <h2>진단</h2>
              </div>
              <VCardText
                readonly
                outline
                rows="2"
                auto-grow
                style="border: 1px solid; border-radius: 5px"
                class="ml-2 mr-2 cardText"
                >{{ chartInfo?.diagnosis }}</VCardText
              >
            </VCard>
          </VRow>

          <!-- 검사 -->
          <VRow style="width: 100%">
            <VCard
              class="pat_chart2 pa-2 ma-2"
              style="width: 100%"
            >
              <div class="letter-spacing">
                <img
                  src="../assets/icons/prescription.png"
                  class="large-icon-size"
                />
                <h2>검사</h2>
              </div>
              <VDivider />
              <VCardText class="pt-2 table-container">
                <table class="list_table">
                  <thead>
                    <tr>
                      <th>검사 ID</th>
                      <th>검사 이름</th>
                      <th>검사 비용</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in selectedExam"
                      :key="index"
                    >
                      <template v-if="item">
                        <td>{{ item.id }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.cost }}</td>
                      </template>
                    </tr>
                  </tbody>
                </table>
              </VCardText>
            </VCard>
          </VRow>

          <!-- 진단 병명 -->
          <VRow style="width: 100%">
            <VCard
              class="pat_chart2 pa-2 ma-2"
              style="width: 100%"
            >
              <div class="letter-spacing">
                <img
                  src="../assets/icons/prescription.png"
                  class="large-icon-size"
                />
                <h2>진단 병명</h2>
              </div>

              <VDivider class="mb-2" />
            </VCard>
          </VRow>

          <!-- 의사 소견 -->
          <VRow style="width: 100%">
            <VCard
              class="pat_chart2 pa-2 ma-2"
              style="width: 100%"
            >
              <div class="letter-spacing">
                <img
                  src="../assets/icons/prescription.png"
                  class="large-icon-size"
                />
                <h2>의사 소견</h2>
              </div>
              <VTextarea
                label="의사 소견"
                outline
                rows="2"
                auto-grow
                style="margin-bottom: 5px"
              ></VTextarea>
            </VCard>
          </VRow>

          <!-- 치료 -->
          <VRow style="width: 100%">
            <VCard
              class="pat_chart2 pa-2 ma-2"
              style="width: 100%"
            >
              <div class="letter-spacing">
                <img
                  src="../assets/icons/prescription.png"
                  class="large-icon-size"
                />
                <h2>치료</h2>
              </div>

              <VDivider class="mb-2" />
            </VCard>
          </VRow>

          <!-- 약물 처방 -->
          <VRow style="width: 100%">
            <VCard
              class="pat_chart2 pa-2 ma-2"
              style="width: 100%"
            >
              <div class="letter-spacing">
                <img
                  src="../assets/icons/prescription.png"
                  class="large-icon-size"
                />
                <h2>처방</h2>
              </div>

              <VDivider />

              <VCardText class="pt-2 table-container">
                <table class="list_table">
                  <thead>
                    <tr>
                      <th>약품 ID</th>
                      <th>약품 이름</th>
                      <th>약품 비용</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in selectedMedicine"
                      :key="index"
                    >
                      <template v-if="item">
                        <td>{{ item.id }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.cost }}</td>
                      </template>
                    </tr>
                  </tbody>
                </table>
              </VCardText>
            </VCard>
          </VRow>
        </div>
      </VRow>
      <VRow>
        <VCol class="text-end">
          <VBtn
            class="ma-2"
            @click="closeModal"
            >닫기</VBtn
          >
        </VCol>
      </VRow>
    </VCard>
  </VDialog>
</template>
