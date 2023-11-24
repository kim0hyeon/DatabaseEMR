<script setup lang="ts">

</script>

<template>
    <input text='text' placeholder="이름을 입력하세요" style="margin-bottom: 20px">
    <VBtn class="mt- offset-md-0.1" style=""> 검색 </VBtn>
    <VRow>
        <VCol col=12>
            <VCard title="환자 리스트">
                <p style="text-align : center">검색한 환자 리스트</p>
            </VCard>
        </VCol>
    </VRow>
    <VRow>
        <VCol col=12>
            <VCard title="환자 통계">
                <p style="text-align : center">통계 프레임</p>
            </VCard>
        </VCol>
    </VRow>

</template>

<style lang="scss">
@use "@core/scss/pages/page-auth.scss";
input{
    padding: 8px;
    border: 3px solid blueviolet;
    border-radius: 7px;
    font-size: 14px;
}
</style>
