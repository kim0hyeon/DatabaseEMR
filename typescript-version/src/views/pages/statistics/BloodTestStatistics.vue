<script lang='ts'>
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()

// 혈액검사 테스트 기록 정보 받아오기 (속성들은 이름 정하면 그때 넣기)
interface BloodTest {
  hemoglobin: number
  fasting_blood_sugar: number
  total_cholesterol: number
  hdl_cholesterol: number
  triglycerides: number
  ldl_cholesterol: number
  serum_creatinine: number
  glomerular_filtration_rate: number
  ast: number
  alt: number
  gamma_gt: number
}

// 혈액검사기록을 저장할 리스트 생성 -> 변경 가능해야함
let BloodTestRecord = ref<BloodTest[]>([])

// 오류나지 않게 임시로 url 넣어놨음. 혈액검사에 맞는 url로 고쳐줘야함
onMounted(async () => {
  try {
    const response = await axios.get('http;//yunsseong.uk:8000/api/patients/')
    BloodTestRecord.value = response.data
    console.log('Blood test record loading success')
  } catch (error) {
    console.error(error)
  }
})
</script>
<template>
  <p>asfdas</p>
</template>
<style lang='scss'>
</style>