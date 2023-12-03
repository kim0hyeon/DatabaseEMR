<script setup lang='ts'>
import { useRoute } from 'vue-router';

// Components 일단 환자 정보를 불러와야 하기 때문에 사용함
import PatientData from '../../../exampleJson/patient.json'
import { defineComponent, ref, onMounted, reactive } from 'vue';
import { Store } from 'pinia';
import { IdStore } from '@/store/index';
import axios from 'axios';

// 사용자 타입 예시 (백엔드에 따라 수정해야 함)
interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  diagnosis: string;
}

const patients = reactive<Patient[]>(PatientData.patients)
console.log(patients);
console.log(IdStore().id);
console.log(patients[IdStore().id]);

let patientId: { id: number; name: string; age: number; gender: string; diagnosis: string; } | undefined;
patientId = patients[0]; // 변수 선언


function clickPatient(event: MouseEvent) {
  patientId = patients.find(patient => patient.id === IdStore().id);

  if (patientId == null) {
    patientId = patients.find(patient => patient.id === 1);
  } else {
    console.log(patientId);
  }
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
                 <h4 class="letter-spacing">{{ patientId.name }}</h4> <!--클릭해도 여기가 안바껴 미치겠음 -->
                <div style="padding: 10px;">
                  <img src="../../../assets/icons/calendar.png" class="small-icon-size">
                  <p>현재 날짜{{ patientId.age }}</p>
                </div>
                <div style="padding: 10px;">
                  <img src="../../../assets/icons/record.png" class="small-icon-size">
                <p>간단한 진료 목적 ex.재진찰</p>
                </div>
              </VCard>
              <VCard>
                <h4 class="letter-spacing">{{ patients[IdStore().id].name }}</h4>
                <div style="padding: 10px;">
                  <img src="../../../assets/icons/calendar.png" class="small-icon-size">
                  <p>과거 방문 날짜</p>
                </div>
                <div style="padding: 10px;">
                  <img src="../../../assets/icons/prescription.png" class="small-icon-size">
                  <p>과거 재활치료 내용</p>
                </div>
                <div style="padding: 10px;">
                  <img src="../../../assets/icons/diagnosis.png" class="small-icon-size">
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
                    <img src="../../../assets/icons/stethoscope.png" class="large-icon-size">
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
                    <img src="../../../assets/icons/picture.png" class="large-icon-size">
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
                <img src="../../../assets/icons/prescription.png" class="large-icon-size">
                <h2>재활치료</h2>
              </div>
              <VTextarea
                label="치료 후기 입력"
                outline
                rows="5"
                auto-grow
                style="margin-bottom: 5px;"
              ></VTextArea>
              <VBtn style=" border-radius: 13px;font-size: 15px;">저장</VBtn>
            </VCard>
          </VCol>
        </VRow>
      </VCard>
    </VCol>
  </VRow>

</template>
<style>
@use "@core/scss/pages/page-auth.scss";
.text-box {
  border: 1px solid #ccc;
  padding: 10px;
  min-height: 100px;
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
</style>