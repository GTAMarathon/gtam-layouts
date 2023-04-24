<template>
  <div id="MediaBoxImage">
    <img
      v-if="data && data.image"
      :key="data.image.name"
      :src="data.image.url"
    />
  </div>
</template>

<script setup lang="ts">
  import { defineProps, onMounted, defineEmits } from 'vue';
  import type { Asset } from '@gtam-layouts/types';
  const props = defineProps<{ data: { image: Asset | undefined } }>();
  const emit = defineEmits(['end']);

  onMounted(() => {
    setTimeout(() => {
      emit('end');
    }, 15000);
  });
</script>

<style scoped>
  #MediaBoxImage {
    width: 100%;
    height: 100%;
    object-fit: contain;
    vertical-align: middle;
  }

  img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
</style>
