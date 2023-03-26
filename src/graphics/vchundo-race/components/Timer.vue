<template>
  <div class="Flex" :style="{ position: 'fixed' }">
    <div
      id="Time"
      :style="{
        'font-size': '2.3em',
        transition: '1s',
        'margin-bottom': '-0.2em',
      }"
    >
      <span v-if="timer && timer.data">
        {{ timer.data.time }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useReplicant } from 'nodecg-vue-composable';
  import { Timer } from 'nodecg/bundles/nodecg-speedcontrol/src/types';

  const timer = useReplicant<Timer>('timer', 'nodecg-speedcontrol');
</script>

<style scoped>
  .Flex {
    flex-direction: column;
  }

  /* Each character in the timer is in a span; setting width so the numbers appear monospaced. */
  #Time > span {
    display: inline-block;
    text-align: center;
    color: #a1ebff;
  }
</style>
