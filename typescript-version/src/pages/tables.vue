<script setup lang="ts">
import DemoSimpleTableBasics from '@/views/pages/tables/DemoSimpleTableBasics.vue';
import DemoSimpleTableDensity from '@/views/pages/tables/DemoSimpleTableDensity.vue';
import DemoSimpleTableTheme from '@/views/pages/tables/DemoSimpleTableTheme.vue';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import patientData from '../exampleJson/patient.json';
interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  diagnosis: string;
}
var isEmptyInfo = false;
const route = useRoute();
interface PatientsData {
  patients: Patient[];
}
const patientsData: PatientsData = patientData;

const patientInfo = ref<Patient | undefined>(undefined);


const getUserInfoByID = () => {
  // Update the value of patientInfo
  patientInfo.value = patientsData.patients.find(patient => patient.id === Number(route.params.id));
  isEmptyInfo = true;
  console.log(isEmptyInfo);
}
watch(() => {
  return route.params.id;
},(newId,oldId) => {
console.log(`ID changed from ${oldId} to ${newId}`);
getUserInfoByID();});
getUserInfoByID();

</script>
<template>
  <VRow>
    <VCol cols="12">
      {{ $route }}
      {{ patientInfo }}
      <!-- {{ data }} -->
      <VCard :title="patientInfo['name']">
        <DemoSimpleTableBasics />
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard title="약제비">
        <VCardText>
          use <code>theme</code> prop to switch table to the dark theme.
        </VCardText>
        <DemoSimpleTableTheme />
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard title="최종금액">
        <VCardText>
          You can show a dense version of the table by using the <code>density</code> prop.
        </VCardText>
        <DemoSimpleTableDensity />
      </VCard>
      <VBtn class="mt-5 offset-md-11"> 출력 </VBtn>
    </VCol>

    <!-- <VCol cols="12">
      <VCard title="Height">
        <VCardText>
          You can set the height of the table by using the <code>height</code> prop.
        </VCardText>
        <DemoSimpleTableHeight />
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard title="Fixed Header">
        <VCardText>
          You can fix the header of table by using the <code>fixed-header</code> prop.
        </VCardText>
        <DemoSimpleTableFixedHeader />
      </VCard>
    </VCol> -->
  </VRow>
</template>
