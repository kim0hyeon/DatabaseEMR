<script lang="ts" setup>
import { mediStore } from '@/store'
import jsQR from 'jsqr'
const store = mediStore()
// 모달창 구현
const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])
let isOpen = ref(props.modelValue)
const closeModal = () => {
  isOpen.value = false
  stopScanning()
  console.log(isOpen.value)
}

watch(
  () => props.modelValue,
  newVal => {
    isOpen.value = newVal
  },
  { immediate: true },
)

watch(
  () => isOpen.value,
  newVal => {
    console.log(isOpen.value)
    if (props.modelValue !== newVal) {
      emit('update:modelValue', newVal)
    }
    if (newVal === true) {
      startScanning()
    }
  },
)

// QR 코드 인식
const video = ref<HTMLVideoElement | null>(null)
let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
let animationFrameId: number | null = null
let stream: MediaStream | null = null
const showVideo = ref(false)
const startScanning = () => {
  showVideo.value = !showVideo.value
  if (showVideo.value) {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(function (s) {
      if (video.value) {
        stream = s
        video.value.srcObject = stream
        video.value.setAttribute('playsinline', 'true')
        video.value.play()
        tick()
      }
    })
  } else {
    stopScanning()
  }
}

const stopScanning = () => {
  if (stream) {
    //초기화 과정
    const tracks = stream.getTracks()
    tracks.forEach(track => track.stop())
    stream = null
    video.value.srcObject = null
    video.value?.removeAttribute('src')
    video.value?.removeAttribute('playsinline')
  }

  cancelAnimationFrame(animationFrameId!)
  animationFrameId = null
  showVideo.value = false
  closeModal()
}

function tick() {
  if (video.value && video.value.readyState === video.value.HAVE_ENOUGH_DATA) {
    if (!canvas) {
      canvas = document.createElement('canvas')
      ctx = canvas.getContext('2d')!
    }
    // 인식 범위 절반으로 줄임
    canvas.width = video.value.videoWidth / 2
    canvas.height = video.value.videoHeight / 2
    ctx.drawImage(video.value, 0, 0, canvas.width, canvas.height)

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    })

    if (code) {
      showVideo.value = false
      console.log('Found QR code', code.data)
      store.setID(code.data)
      stopScanning()
    }
  }
  animationFrameId = requestAnimationFrame(tick)
}

watch(
  () => showVideo.value,
  (newP, oldP) => {
    console.log(`showVideo changed from ${oldP} to ${newP}`)
  },
)
</script>

<template>
  <VDialog
    v-model="isOpen"
    class="dialog"
  >
    <VCard class="card">
      <div
        v-show="showVideo"
        class="ma-4"
      >
        <video
          ref="video"
          class="video"
        ></video>
      </div>

      <VBtn @click="closeModal">닫기</VBtn>
    </VCard>
  </VDialog>
</template>

<style scoped>
.dialog {
  inline-size: 100%;
  max-inline-size: 600px;
}

.card {
  inline-size: 100%;
}

.video {
  block-size: auto;
  inline-size: 100%;
}
</style>
