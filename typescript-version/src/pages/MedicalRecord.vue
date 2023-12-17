<script lang="ts" setup>
import { IdStore } from '@/store/index'
import { Reception, Chart, Photo, Inspect, Treatment, Disease, Medication } from "@/pages/interfaces";
import axios from 'axios'
import { ref } from 'vue'
// 사용자 타입 예시 (백엔드에 따라 수정해야 함)
const store = IdStore()
const token = sessionStorage.getItem('token')

const photos = ref<Photo[]>([])
const selectedPhoto = ref('')

// 백엔드에서 환자 정보 받아오기
let receptionInfo = ref<Reception>()
let chartInfo = ref<Chart>()
let inspectionData = ref<Inspect[]>([])
let diseaseData = ref<Disease[]>([])
let treatmentData = ref<Treatment[]>([])
let medicationData = ref<Medication[]>([])

const getReceptionInfo = async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/receptions?reception_id=${props.reception_id}`, {
      headers: { Authorization: `Token ${token}` },
    })
    receptionInfo.value = response.data[0]
  } catch (error) {
    console.error(error)
  }
}

const getChartInfo = async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/chart?chart_id=${props.chart_id}`, {
      headers: { Authorization: `Token ${token}` },
    })
    chartInfo.value = response.data[0]
    console.log(chartInfo.value)
  } catch (error) {
    console.error(error)
  }
}

const getInspectList = async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/inspect_type/`, {
      headers: { Authorization: `Token ${token}` },
    })
    inspectionData.value = response.data
  } catch (error) {
    console.error(error)
  }
}

const getDiseaseList = async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/disease/`,
      { headers: { Authorization: `Token ${token}` }}
    )
    diseaseData.value = response.data
  } catch (error) {
    console.error(error)
  }
}

const getTreatmentList = async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/treatment/`,
      { headers: { Authorization: `Token ${token}` }}
    )
    treatmentData.value = response.data
  } catch (error) {
    console.error(error)
  }
}

const getMedicationList = async () => {
  try {
    const response = await axios.get(`http://yunsseong.uk:8000/api/medication/`,
      { headers: { Authorization: `Token ${token}` }}
    )
    medicationData.value = response.data
  } catch (error) {
    console.error(error)
  }
}

// 환자가 받은 검사 목록
let patientInspections = ref<Inspect[]>([])

watchEffect(() => {
  if (chartInfo.value && inspectionData.value.length > 0) {
    const inspections = chartInfo.value.inspect.map(inspect_id => {
      return inspectionData.value.find(inspection => inspection.inspect_type_id === inspect_id)
    })

    patientInspections.value = inspections.filter(Boolean) as Inspect[]
  }
})

// 환자의 병명 목록
let patientDiseases = ref<Disease[]>([])

watchEffect(() => {
  if (chartInfo.value && diseaseData.value.length > 0) {
    const diseases = chartInfo.value?.disease.map(disease_id => {
      return diseaseData.value.find(disease => disease.id === disease_id)
    })

    patientDiseases.value = diseases.filter(Boolean) as Disease[]
  }
})

// 환자의 치료 목록
let patientTreatment = ref<Treatment[]>([])

watchEffect(() => {
  if (chartInfo.value && treatmentData.value.length > 0) {
    const treatments = chartInfo.value?.treatment.map(treatment_code => {
      return treatmentData.value.find(treatment => treatment.treatment_code === treatment_code)
    })

    patientTreatment.value = treatments.filter(Boolean) as Treatment[]
  }
})

// 환자의 처방 목록
let patientMedication = ref<Medication[]>([])

watchEffect(() => {
  if (chartInfo.value && medicationData.value.length > 0) {
    const medications = chartInfo.value?.medication.map(medication_code => {
      return medicationData.value.find(medication => medication.medication_code === medication_code)
    })

    patientMedication.value = medications.filter(Boolean) as Medication[]
  }
})

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

    getChartInfo()

    getReceptionInfo()

    getInspectList()
    getDiseaseList()
    getTreatmentList()
    getMedicationList()
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
                >{{ chartInfo?.diagnosis }}</VCardText>
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
                      v-for="(item, index) in patientInspections"
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
                    v-for="(item, index) in patientDiseases"
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
              <VCardText
                readonly
                outline
                rows="2"
                auto-grow
                style="border: 1px solid; border-radius: 5px"
                class="ml-2 mr-2 cardText"
              >{{ chartInfo?.doctor_opinion }}</VCardText>
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
                    v-for="(item, index) in patientTreatment"
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
                      v-for="(item, index) in patientMedication"
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
