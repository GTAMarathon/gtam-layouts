<template>
  <div class="Flex" :style="{ position: 'fixed' }">
    <div
      id="Time"
      v-if="timer && timer.data"
      :class="timer.data.state"
      :style="{
        'font-size': '2.8em',
        transition: '1s',
        'margin-bottom': '-0.2em',
      }"
    >
      <span
        v-for="char in timer.data.time.split('')"
        :key="`${Math.random()}${char}`"
        :class="char === ':' ? 'Colon' : undefined"
      >
        {{ char }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Timer } from 'speedcontrol/types';
  import { useReplicant } from 'nodecg-vue-composable';

  const timer = useReplicant<Timer>('timer', 'nodecg-speedcontrol');
</script>

<style scoped>
  .Flex {
    flex-direction: column;
  }

  /* Each character in the timer is in a span; setting width so the numbers appear monospaced. */
  #Time > span,
  #Estimate > span {
    display: inline-block;
    width: 0.52em;
    text-align: center;
  }
  #Time > .Colon,
  #Estimate > .Colon {
    width: 0.3em;
  }

  .stopped {
    color: #a3a3a3;
  }
  .running {
    color: #C736FF;
  }
  .paused {
    color: #a304e2;
  }
  .finished {
    color: #ffd557;
  }
</style>
