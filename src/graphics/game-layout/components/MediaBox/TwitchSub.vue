<template>
  <div
    id="MediaBoxTwitchSub"
    v-if="subInfo"
    :style="{
      textShadow: '2px 2px 2px #12222c',
      flexDirection: 'column',
      gap: '20px',
    }"
    class="Flex"
  >
    <img :src="getRandomEmote()" />
    <span :style="{ fontWeight: 'normal' }"
      ><template
        ><b class="highlight">{{ subInfo.name }}</b> has subscribed with a
        <b class="highlight">Tier {{ subInfo.tier }}</b> subscription for
        <b class="highlight">{{ subInfo.months }} months</b>!</template
      ></span
    >
  </div>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue';
  import { getRandomEmote } from './randomEmote';
  const props = defineProps({
    subInfo: {
      type: Object,
      required: true,
    },
  });
</script>

<style scoped>
  .highlight {
    color: #4fbafe;
  }
</style>
