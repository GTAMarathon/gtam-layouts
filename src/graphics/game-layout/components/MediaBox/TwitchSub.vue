<template>
  <div
    id="MediaBoxTwitchSub"
    v-if="data && data.subInfo"
    :style="{
      textShadow: '2px 2px 2px #12222c',
      flexDirection: 'column',
      gap: '20px',
    }"
    class="Flex"
  >
    <img :src="getRandomEmote()" />
    <span :style="{ fontWeight: 'normal' }"
      ><b class="highlight">{{ data.subInfo.name }}</b> has subscribed with a
      <b class="highlight">Tier {{ data.subInfo.tier }}</b> subscription for
      <b class="highlight">{{ data.subInfo.months }} months</b>!</span
    >
  </div>
</template>

<script setup lang="ts">
  import type { SubQueueItem } from '@gtam-layouts/types';
  import { defineProps, defineEmits, onMounted } from 'vue';
  import { getRandomEmote } from './randomEmote';
  const props = defineProps<{ data: { subInfo: SubQueueItem | undefined } }>();
  const emit = defineEmits(['end']);

  onMounted(() => {
    setTimeout(() => {
      emit('end');
    }, 25000);
  });
</script>

<style scoped>
  .highlight {
    color: #4fbafe;
  }
</style>
