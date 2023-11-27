<script setup lang="ts">
import {ref} from 'vue';
import {reactive} from 'vue';

// 저장된 이미지 경로를 계속 변경하려고 만듦
interface ImgPath{
  [key: string]: string;
}
const imgpath: ImgPath = reactive({
  path1: '../assets/icons/noimg.png',
});
function updatePath(pathKey: string, newPath: string){
  imgpath[pathKey] = newPath;
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
                <h4 class="letter-spacing">이름</h4>
                <div style="padding: 10px">
                  <img src="../assets/icons/calendar.png" class="small-icon-size">
                  <p>오늘 날짜</p>
                </div>
                <div style="padding: 10px">
                  <img src="../assets/icons/record.png" class="small-icon-size">
                <p>간단한 진료 목적 ex.재진찰</p>
                </div>
              </VCard>
              <VCard class="visit-history-box">
                <h4 class="letter-spacing">이름</h4>
                <div style="padding: 10px">
                  <img src="../assets/icons/calendar.png" class="small-icon-size">
                  <p>과거 날짜</p>
                </div>
                <div style="padding: 10px">
                  <img src="../assets/icons/record.png" class="small-icon-size">
                <p>과거 방문 목적</p>
                </div>
                <div style="padding: 10px">
                  <img src="../assets/icons/diagnosis.png" class="small-icon-size">
                  <p>병명</p>
                </div>
              </VCard>
              <VCard>
                <h4 class="letter-spacing">이름</h4>
                <div style="padding: 10px">
                  <img src="../assets/icons/calendar.png" class="small-icon-size">
                  <p>과거 날짜</p>
                </div>
                <div style="padding: 10px">
                  <img src="../assets/icons/prescription.png" class="small-icon-size">
                  <p>처방or치료내용</p>
                </div>
                <div style="padding: 10px">
                  <img src="../assets/icons/medicine.png" class="small-icon-size">
                  <p>배포약</p>
                </div>
              </VCard>
            </VCard>
          </VCol>
          <VCol cols="9">
            <VRow>
              <VCol cols="9">
                  <VCard class="px-2 py-2">
                    <div class="letter-spacing">
                    <img src="../assets/icons/stethoscope.png" class="large-icon-size">
                    <h2>진료기록</h2>
                    </div>
                    <VTextarea
                    label="여기에 입력하세요"
                    outline
                    rows="10"
                    auto-grow
                    style="margin-bottom:5px;"
                    ></VTextarea>
                    <VBtn style="font-size: 15px; border-radius: 13px" >저장</VBtn>
                  </VCard>
              </VCol>
              <VCol cols="3">
                <VCard class="px-2 py-2">
                  <div class="letter-spacing">
                    <img src="../assets/icons/picture.png" class="large-icon-size">
                    <h2>사진</h2>
                  </div>
                  <VFileInput></VFileInput>
                  <div>
                    <img :src='imgpath.path1' class="upload-img">
                  </div>
                </VCard>
              </VCol>
            </VRow>
            <VTab></VTab>
            <VCard class="px-2 py-2">
              <div class="letter-spacing">
                <img src="../assets/icons/prescription.png" class="large-icon-size">
                <h2>진단 및 처방</h2>
              </div>
              <VTextarea
                label="여기에 입력하세요"
                outline
                rows="10"
                auto-grow
                style="margin-bottom:5px;"
              ></VTextArea>
              <VBtn style="font-size: 15px; border-radius: 13px">저장</VBtn>
            </VCard>
          </VCol>
        </VRow>
      </VCard>
    </VCol>
  </VRow>

</template>

<style lang="scss">
@use "@core/scss/pages/page-auth.scss";
.visit-history-box{
  margin-bottom: 10px;
}
.letter-spacing{
  padding: 10px;
}
.large-icon-size{
  width: auto;
  height: 30px;
  float: left;
  margin-right: 10px;

}
.small-icon-size{
  width: auto;
  height: 24px;
  float: left;
  margin-right: 10px;
}
.upload-img{
  padding: 20px;
  width: 100%;
  height: auto;
}
</style>
