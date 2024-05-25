<script setup lang="ts">
  import Ticker from './components/Ticker.vue';
</script>

<template>
  <div
    :style="{
      position: 'fixed',
      width: '1920px',
      height: '74px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      overflow: 'hidden',
    }"
  >
    <div
      id="topBorder"
      :style="{
        backgroundColor: '#c736ff',
        position: 'absolute',
        width: '100%',
        height: '4px',
        zIndex: 2,
      }"
    ></div>
    <Ticker :style="{ zIndex: 1 }" />
  </div>
</template>

<style>
  @import url('../_misc/common.css');
  @import url('../_misc/Fade.css');
  @import url('../_misc/Flex.css');
</style>
