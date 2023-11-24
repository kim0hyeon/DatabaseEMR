<script setup lang="ts">
import PatientData from './Patient.json';

const patient = PatientData.patients;

const examinations = [
  {
    examination: '간 초음파 검사',
    cost: 10300,
    origin: 10300*7/8,
    tax: 10300/8,
  },
  {
    examination: '관절조영술',
    cost: 21000,
    origin: 21000*7/8,
    tax: 21000/8,
  },
  {
    examination: '담도조영술',
    cost: 9500,
    origin: 9500*7/8,
    tax: 9500/8,
  },
  {
    examination: '청력검사',
    cost: 6000,
    origin: 6000*7/8,
    tax: 6000/8,
  },
  {
    examination: '내시경검사',
    cost: 1200,
    origin: 1200*7/8,
    tax: 1200/8,
  },
]
</script>

<template>
  <VTable density="compact">
    <thead>
      <tr>
        <th class="text-uppercase">
          examinations
        </th>
        <th class="text-uppercase text-center">
          origin
        </th>
        <th class="text-uppercase text-center">
          tax(g)
        </th>
        <th class="text-uppercase text-center">
          cost
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="item in patient"
        :key="item.id"
      >
        <td>
          {{ item.name }}
        </td>
        <td class="text-center">
          {{ item.age }}
        </td>
        <td class="text-center">
          {{ item.gender }}
        </td>
        <td class="text-center">
          {{ item.diagnosis }}
        </td>
      </tr>
    </tbody>
  </VTable>
</template>
