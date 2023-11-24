<script setup lang="ts">
import DemoSimpleTableBasics from '@/views/pages/tables/DemoSimpleTableBasics.vue';
import DemoSimpleTableDensity from '@/views/pages/tables/DemoSimpleTableDensity.vue';
import DemoSimpleTableTheme from '@/views/pages/tables/DemoSimpleTableTheme.vue';
import { onMounted, ref } from 'vue';

const queryName = ref('')
const queryAge = ref(0)
const router = useRouter()
const url = window.location.href;
  // URL에서 "practice" 부분 추출
  const match = url.match(/\/(\w+)2/);

  // match 배열의 두 번째 요소에 추출된 부분이 들어 있음
  const extractedValue = match ? match[1] : null;

  console.log(extractedValue); // "practice"
onMounted(() => {
  // 컴포넌트가 마운트되면 URL 쿼리 매개변수를 받아와 설정
  queryName.value = history.state.name || ''
  queryAge.value = history.state.age || 0
})

</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="환자이름(검사비)">
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
