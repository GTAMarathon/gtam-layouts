<template>
  <div
    id="MediaBoxTwitchSub"
    v-if="bitsInfo"
    :style="{
      textShadow: '2px 2px 2px #12222c',
      flexDirection: 'column',
      gap: '20px',
    }"
    class="Flex"
  >
    <img :src="getRandomEmote()" />
    <span :style="{ fontWeight: 'normal' }"
      ><b class="highlight">{{ bitsInfo.name }}</b> has cheered
      <b :style="{ color: getBitsColor(bitsInfo.amount) }"
        >{{ bitsInfo.amount }} bits</b
      >!</span
    >
  </div>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue';
  import { getRandomEmote } from './randomEmote';
  const props = defineProps({
    bitsInfo: {
      type: Object,
      required: true,
    },
  });

  function getBitsColor(amount: number) {
    if (amount < 100) {
      return '#cbc8d0';
    } else if (100 < amount && amount < 1000) {
      return '#ca7fff';
    } else if (1000 < amount && amount < 5000) {
      return '#4aadff';
    } else if (5000 < amount && amount < 10000) {
      return '#ff271e';
    } else if (10000 < amount && amount < 25000) {
      return '#f161aa';
    } else if (25000 < amount && amount < 50000) {
      return '#fb881d';
    } else if (50000 < amount && amount < 75000) {
      return '#16d03d';
    } else if (75000 < amount && amount < 100000) {
      return '#fcca0f';
    } else {
      return '#4fbafe';
    }
  }
</script>

<style scoped>
  .highlight {
    color: #4fbafe;
  }
</style>
