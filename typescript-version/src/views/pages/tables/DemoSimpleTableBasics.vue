<script setup lang="ts">
const examinations = [
  {
    examination: '간 초음파 검사',
    id: 1,
    cost: 10300,
    origin: 10300*7/8,
    tax: 10300/8,
  },
  {
    examination: '관절조영술',
    id: 2,
    cost: 21000,
    origin: 21000*7/8,
    tax: 21000/8,
  },
  {
    examination: '담도조영술',
    id: 3,
    cost: 9500,
    origin: 9500*7/8,
    tax: 9500/8,
  },
  {
    examination: '청력검사',
    id: 4,
    cost: 6000,
    origin: 6000*7/8,
    tax: 6000/8,
  },
  {
    examination: '내시경검사',
    id: 5,
    cost: 1200,
    origin: 1200*7/8,
    tax: 1200/8,
  },

]
</script>

<template>
  <VTable>
    <thead>
      <tr>
        <th class="text-uppercase">
          검사 ID
        </th>
        <th class="text-uppercase">
          검사 항목
        </th>
        <th class="text-uppercase text-center">
          origin
        </th>
        <th class="text-uppercase text-center">
          tax
        </th>
        <th class="text-uppercase text-center">
          cost
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="item in examinations"
        :key="item.examination"
      >
        <td>
          {{ item.id }}
        </td>
        <td>
          {{ item.examination }}
        </td>
        <td class="text-center">
          {{ item.origin }}
        </td>
        <td class="text-center">
          {{ item.tax }}
        </td>
        <td class="text-center">
          {{ item.cost }}
        </td>
      </tr>
    </tbody>
  </VTable>
</template>
