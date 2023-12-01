<script lang="ts" setup>
import avatar1 from '@images/avatars/avatar-1.png';
import axios from 'axios'

const accountData = {
  avatarImg: avatar1,
  Name: '홍길동',
  firstRRN: '010101',
  gender: '남성',
  LastRRN: '1234567',
  org: 'ThemeSelection',
  phone: '010-XXXX-YYYY',
  emergencyPhone: '010-YYYY-XXXX',
  address: '경기도 안산시 상록구 한양대학로 55',
  patientType: '선택안함',
  purpose: '방문 목적 기입'
}

const refInputEl = ref<HTMLElement>()

const accountDataLocal = ref(structuredClone(accountData))

// 주민등록번호 뒷자리 가리기
const isLastRRNVisible = ref(false)

// 약관 전체 동의 구현
let termsAll = ref(false)
let termsPrivacy = ref(false)
let termsMarketing = ref(false)

const checkAll = () => {
  termsPrivacy.value = termsAll.value
  termsMarketing.value = termsAll.value
}

// changeAvatar function
const changeAvatar = (file: Event) => {
  const fileReader = new FileReader()
  const { files } = file.target as HTMLInputElement

  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string')
        accountDataLocal.value.avatarImg = fileReader.result
    }
  }
}

// reset avatar image
const resetAvatar = () => {
  accountDataLocal.value.avatarImg = accountData.avatarImg
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
    const response = await axios.post('http://yunsseong.uk/api/patient', accountDataLocal.value);
    if (response.status === 200) {
      console.log('Data submitted successfully');
      closeModal();
    } else {
      console.log('Failed to submit data');
    }
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
                <VCardText class="d-flex">
                  <!-- 👉 Avatar -->
                  <VAvatar
                    rounded="lg"
                    size="100"
                    class="me-6"
                    :image="accountDataLocal.avatarImg"
                  />

                  <!-- 👉 Upload Photo -->
                  <form class="d-flex flex-column justify-center gap-5">
                    <div class="d-flex flex-wrap gap-2">
                      <VBtn
                        color="primary"
                        @click="refInputEl?.click()"
                      >
                        <VIcon
                          icon="mdi-cloud-upload-outline"
                          class="d-sm-none"
                        />
                        <span class="d-none d-sm-block">사진 업로드</span>
                      </VBtn>

                      <input
                        ref="refInputEl"
                        type="file"
                        name="file"
                        accept=".jpeg,.png,.jpg,GIF"
                        hidden
                        @input="changeAvatar"
                      >

                      <VBtn
                        type="reset"
                        color="error"
                        variant="tonal"
                        @click="resetAvatar"
                      >
                        <span class="d-none d-sm-block">Reset</span>
                        <VIcon
                          icon="mdi-refresh"
                          class="d-sm-none"
                        />
                      </VBtn>
                    </div>
                  </form>
                </VCardText>

                <VDivider />

                <VCardText>
                  <!-- 👉 Form -->
                  <VForm class="mt-6">
                    <VRow>
                      <!-- 이름 -->
                      <VCol cols="12">
                        <VTextField
                          v-model="accountDataLocal.Name"
                          label="이름"
                        />
                      </VCol>

                      <!-- 주민등록번호 앞자리 -->
                      <VCol
                        md="4"
                        cols="12"
                      >
                        <VTextField
                          v-model="accountDataLocal.firstRRN"
                          label="주민번호 앞자리"
                        />
                      </VCol>

                      <!-- 주민등록번호 뒷자리 -->
                      <VCol
                        cols="12"
                        md="4"
                      >
                        <VTextField
                          v-model="accountDataLocal.LastRRN"
                          :type="isLastRRNVisible ? 'text' : 'password'"
                          :append-inner-icon="isLastRRNVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                          label="주민번호 뒷자리"
                          @click:append-inner="isLastRRNVisible = !isLastRRNVisible"
                        />
                      </VCol>

                      <!-- 성별 -->
                      <VCol
                        md="4"
                        cols="12">
                        <VSelect
                          v-model="accountDataLocal.gender"
                          label="성별"
                          :items="['남성', '여성', '기타']"
                        />
                      </VCol>

                      <!-- 연락처 -->
                      <VCol
                        cols="12"
                        md="6"
                      >
                        <VTextField
                          v-model="accountDataLocal.phone"
                          label="연락처"
                        />
                      </VCol>

                      <!-- 비상 연락처 -->
                      <VCol
                        cols="12"
                        md="6"
                      >
                        <VTextField
                          v-model="accountDataLocal.emergencyPhone"
                          label="비상 연락처"
                        />
                      </VCol>

                      <!-- 주소 -->
                      <VCol
                        cols="12"
                      >
                        <VTextField
                          v-model="accountDataLocal.address"
                          label="주소"
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
                  <!-- 환자 유형 -->
                  <VCard
                    title="환자 유형"
                  >
                    <VCardText>
                      <div>
                        <VSelect
                          v-model="accountDataLocal.patientType"
                          label="환자 유형"
                          :items="['선택안함','일반환자','중증환자','VIP']"
                        />
                      </div>
                    </VCardText>
                    <VCol>
                      <VTextarea
                        v-model="accountDataLocal.purpose"
                        label="방문 사유"
                      />
                    </VCol>
                  </VCard>
                </VCol>
              </VRow>
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
                        v-model="termsPrivacy"
                        label="(필수)개인정보 수집 및 이용 동의"
                      />
                    </VCol>

                    <VCol cols="12">
                      <VCheckbox
                        v-model="termsMarketing"
                        label="(선택)병의원 마케팅 정보 수신 동의"
                      />
                    </VCol>
                  </VCard>
                </VCol>
              </VRow>

              <!-- 접수 및 취소 버튼 -->
              <VRow justify="end" align="end">

                <VCol cols="auto">
                  <v-btn @click="closeModal">접수</v-btn>
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
