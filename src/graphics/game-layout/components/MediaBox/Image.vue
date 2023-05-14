<template>
  <div id="MediaBoxImage" class="Flex">
    <img v-if="image && image.name" :key="image.name" :src="image.url" />
  </div>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue';
  import { $ref } from 'vue/macros';
  const props = defineProps({
    image: {
      type: Object,
      required: true,
    },
    useWidescreen: {
      type: Boolean,
    },
  });
  const image = $ref(
    props.useWidescreen ? props.image.widescreen : props.image.standard
  );
</script>

<style scoped>
  #MediaBoxImage {
    width: 100%;
    height: 100%;
    object-fit: contain;
    vertical-align: middle;
    align-items: center;
    align-content: center;
    margin: auto;
  }

  img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
  }
</style>
