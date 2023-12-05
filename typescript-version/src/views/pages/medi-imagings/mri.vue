<script lang="ts" setup>
import { IdStore } from '@/store'
const store = IdStore()

import { ref } from 'vue'

interface Photo {
  url: string
  name: string
}

const photos = ref<Photo[]>([])
const selectedPhoto = ref('')
function handleFilesUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files) {
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = e => {
        if (e.target?.result) {
          const url = e.target.result.toString()
          // 최근 업로드가 위로오도록 unshift사용
          photos.value.unshift({ url, name: file.name })
          selectedPhoto.value = e.target.result.toString()
        }
      }
      reader.readAsDataURL(file)
    })
  }
}

function removePhoto(index: number) {
  photos.value.splice(index, 1)
}
function selectImage(image: Photo) {
  selectedPhoto.value = image.url
}
</script>
<style scoped>
.scroll-container {
  padding: 10px; /* 패딩 설정 */
  border: 1px solid #ccc; /* 경계선 스타일 */
  margin: 20px; /* 컨테이너 마진 */
  overflow-y: auto; /* 높이를 초과하면 y축 스크롤 바 표시 */
}

.sm-image {
  max-block-size: 50px;
  max-inline-size: 50px;
}

.sel-photo {
  block-size: 600px; /* 이미지의 최대 높이를 조절하세요 */
  cursor: pointer;
  inline-size: 600px;
}

.photo {
  position: relative;
  margin: auto;
}

.noimage {
  block-size: 600px; /* 이미지의 최대 높이를 조절하세요 */
  color: #555;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  inline-size: 600px;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  transform: translate(41%, 45%);
}

.custom-file-upload {
  position: relative;
  display: inline-block;
  margin: 5px;
  cursor: pointer;
}

.custom-file-upload input[type='file'] {
  display: none;
}

.custom-file-upload span {
  border-radius: 5px;
  background-color: #3498db;
  color: #fff;
  padding-block: 8px;
  padding-inline: 12px;
}

.photo_list {
  inline-size: 300px;
}

.name {
  overflow: hidden;
  font-size: 18px;
  margin-block-start: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.photo-vcard {
  margin-block-start: 30px;
}
</style>

<template>
  <div></div>
  <VRow>
    <Vcol>
      <VCard class="photo-vcard">
        <div class="photo">
          <div v-if="photos.length > 0">
            <img
              class="sel-photo"
              :src="selectedPhoto"
            />
          </div>
          <div
            class="noimage"
            v-else
          >
            <h1>사진없음</h1>
          </div>
        </div>
      </VCard>
    </Vcol>
    <VCol>
      <VCard class="photo_list scroll-container">
        <h2 v-if="store.id != 0">ID가 &nbsp;{{ store.id }}인 이름</h2>
        <label
          for="mri_image"
          class="custom-file-upload"
        >
          <span>파일 선택</span>
          <input
            type="file"
            id="mri_image"
            @change="handleFilesUpload"
          />
        </label>
        <VBtn class="ma-2">제출</VBtn>
        <div v-if="photos.length > 0">
          <div
            v-for="(photo, index) in photos"
            :key="photo.name"
          >
            <VDivider class="ma-3" />
            <img
              :src="photo.url"
              :alt="photo.name"
              class="sm-image"
            />
            <p class="name">{{ photo.name }}</p>

            <button @click="selectImage(photo)">(overview)</button>
            &nbsp;
            <button @click="removePhoto(index)">(remove)</button>
          </div>
        </div>
      </VCard>
    </VCol>
  </VRow>
</template>
