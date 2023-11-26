<script setup lang="ts">

</script>

<template>

  <VRow>
    <VCol cols="3" class="col">
      <VCard title="내원이력">
        <div class="visit-histroy">
          <h4>환자이름</h4>
          <p>오늘날짜</p>
          <p>방문목적</p>
        </div>

        <div class="divider"></div>

        <div class="visit-histroy">
          <h4>환자이름</h4>
          <p>가장최근방문날짜</p>
          <p>방문했던목적</p>
          <p>진단했던결과(진단명)</p>
          <p>처방,치료내역</p>
        </div>
      </VCard>
    </VCol>
    <VCol cols="7" style="margin-right : 0px">
      <VCard title="진료내용">
        <p style="text-align : center">진료 내용이 들어올 자리</p>
      </VCard>
    </VCol>

    <VCol cols="2" style="margin-left : 0px;">
      <VCard title="사진및영상" style="padding : 10px">
        <p style="text-align : center">사진&영상 미리보기</p>
        <VBtn class="mt-5 offset-md-8"> 업로드 </VBtn>
      </VCard>
    </VCol>
  </VRow>

  <VRow>
    <VCol cols="12">

      <VCard title="진단">
        <p style="text-align : center">진단 내용이 들어올 자리</p>
      </VCard>

      <VCard title="처방">
        <p style="text-align : center">처방 내용이 들어올 자리</p>
      </VCard>

    </VCol>
  </VRow>

</template>

<style lang="scss">
@use "@core/scss/pages/page-auth.scss";

.visit-histroy{
  padding-left: 15px;
}
.divider{
  width: 100%;
  height: 1px;
  background-color: #ccc;
  margin-bottom: 10px;
}
</style>
