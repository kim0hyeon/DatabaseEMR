<script setup lang="ts">


</script>

<template>

  <VRow>
    <VCol cols="9">
      <VCard title="진료내용">
        <p style="text-align : center">진료 내용이 들어올 자리</p>
      </VCard>
    </VCol>

    <VCol cols="3">
      <VCard title="사진 & 영상" style="padding : 10px">
        <p style="text-align : center">사진&영상 미리보기</p>
        <VBtn class="mt-5 offset-md-8"> 업로드 </VBtn>
      </VCard>
    </VCol>
  </VRow>

  <VRow>
    <VCol cols="6">
      <VCard title="진단">
        <p style="text-align : center">진단 내용이 들어올 자리</p>
      </VCard>
    </VCol>
    
    <VCol cols="6">
      <VCard title="처방">
        <p style="text-align : center">처방 내용이 들어올 자리</p>
      </VCard>
    </VCol>
  </VRow>

</template>

<style lang="scss">
@use "@core/scss/pages/page-auth.scss";
</style>
