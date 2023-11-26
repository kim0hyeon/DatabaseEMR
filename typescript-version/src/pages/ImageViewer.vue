<template>
  <div>
    <h2>자식 컴포넌트</h2>
    <ul>
      <!-- <li
        v-for="(file, index) in files"
        :key="index"
      > -->
      {{
        router
      }}
      <!-- </li> -->
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
