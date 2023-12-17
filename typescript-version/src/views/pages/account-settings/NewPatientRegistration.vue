<script lang="ts" setup>
import axios from 'axios'
import {token} from "@/token";

const patientData = {
  patient_name: '',
  patient_gender: '선택',
  patient_birth: '',
  patient_residence_number: '',
  patient_phone_number: '',
  patient_emergency_phone_number: '',
  patient_address: '',
  patient_agree_essential_term: false,
  patient_agree_optional_term: false
}

const patientDataLocal = ref(structuredClone(patientData))

// 주민등록번호 뒷자리 가리기
const isLastRRNVisible = ref(false)

// 약관 전체 동의 구현
let termsAll = ref(false)

const checkPrivacy = () => {
  patientDataLocal.value.patient_agree_essential_term = !patientDataLocal.value.patient_agree_essential_term
}

const checkMarketing = () => {
  patientDataLocal.value.patient_agree_optional_term = !patientDataLocal.value.patient_agree_optional_term
}

const checkAll = () => {
  checkPrivacy()
  checkMarketing()
}

// 모달창 구현
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

// 백엔드로 환자 정보 전송
const submitForm = async () => {
  try {
    const data = {
      patient_name: patientDataLocal.value.patient_name,
      patient_gender: patientDataLocal.value.patient_gender,
      patient_birth: patientDataLocal.value.patient_birth,
      patient_residence_number: patientDataLocal.value.patient_residence_number,
      patient_phone_number: patientDataLocal.value.patient_phone_number,
      patient_emergency_phone_number: patientDataLocal.value.patient_emergency_phone_number,
      patient_address: patientDataLocal.value.patient_address,
      patient_agree_essential_term: patientDataLocal.value.patient_agree_essential_term,
      patient_agree_optional_term: patientDataLocal.value.patient_agree_optional_term
    }


    console.log('submit patient data')
    console.log(data)
    const response = await axios.post('http://yunsseong.uk:8000/api/patients/', data,
        { headers: { Authorization: `Token ${token.value}` }});
    console.log('submit success')
    closeModal()
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <v-dialog v-model="isOpen" max-width="1200px">
    <v-card>
      <v-card-title class="headline">신규 환자 등록</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <!-- 왼쪽 화면 내용 -->
            <v-col cols="6">
              <VCard title="환자 신상 정보">

                <VDivider />

                <VCardText>
                  <!-- 👉 Form -->
                  <VForm class="mt-6">
                    <VRow>
                      <!-- 이름 -->
                      <VCol cols="12">
                        <VTextField
                          v-model="patientDataLocal.patient_name"
                          label="이름"
                          placeholder="홍길동"
                        />
                      </VCol>

                      <!-- 주민등록번호 앞자리 -->
                      <VCol
                        md="4"
                        cols="12"
                      >
                        <VTextField
                          v-model="patientDataLocal.patient_birth"
                          label="주민번호 앞자리"
                          placeholder="010101"
                        />
                      </VCol>

                      <!-- 주민등록번호 뒷자리 -->
                      <VCol
                        cols="12"
                        md="4"
                      >
                        <VTextField
                          v-model="patientDataLocal.patient_residence_number"
                          :type="isLastRRNVisible ? 'text' : 'password'"
                          :append-inner-icon="isLastRRNVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                          label="주민번호 뒷자리"
                          placeholder="1234567"
                          @click:append-inner="isLastRRNVisible = !isLastRRNVisible"
                        />
                      </VCol>

                      <!-- 성별 -->
                      <VCol
                        md="4"
                        cols="12">
                        <VSelect
                          v-model="patientDataLocal.patient_gender"
                          label="성별"
                          :items="['남', '여']"
                        />
                      </VCol>

                      <!-- 연락처 -->
                      <VCol
                        cols="12"
                        md="6"
                      >
                        <VTextField
                          v-model="patientDataLocal.patient_phone_number"
                          label="연락처"
                          placeholder="010-XXXX-YYYY"
                        />
                      </VCol>

                      <!-- 비상 연락처 -->
                      <VCol
                        cols="12"
                        md="6"
                      >
                        <VTextField
                          v-model="patientDataLocal.patient_emergency_phone_number"
                          label="비상 연락처"
                          placeholder="010-YYYY-XXXX"
                        />
                      </VCol>

                      <!-- 주소 -->
                      <VCol
                        cols="12"
                      >
                        <VTextField
                          v-model="patientDataLocal.patient_address"
                          label="주소"
                          placeholder="경기도 안산시 상록구 한양대학로 55"
                        />
                      </VCol>
                    </VRow>
                  </VForm>
                </VCardText>
              </VCard>
            </v-col>

            <!-- 오른쪽 화면 내용 -->
            <v-col cols="6">
              <VRow>
                <VCol cols="12">
                  <!-- 약관 동의 -->
                  <VCard>
                    <VCol cols="12">
                      <VCheckbox
                        v-model="termsAll"
                        label="약관 전체 동의"
                        @change="checkAll"
                      />
                    </VCol>

                    <VDivider />

                    <VCol cols="12">
                      <VCheckbox
                        v-model="patientDataLocal.patient_agree_essential_term"
                        label="(필수)개인정보 수집 및 이용 동의"
                      />
                    </VCol>

                    <VCol cols="12">
                      <VCheckbox
                        v-model="patientDataLocal.patient_agree_optional_term"
                        label="(선택)병의원 마케팅 정보 수신 동의"
                      />
                    </VCol>
                  </VCard>
                </VCol>
              </VRow>

              <!-- 접수 및 취소 버튼 -->
              <VRow justify="end" align="end">

                <VCol cols="auto">
                  <v-btn @click="submitForm">등록</v-btn>
                </VCol>

                <VCol cols="auto">
                  <v-btn @click="closeModal">취소</v-btn>
                </VCol>

              </VRow>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
