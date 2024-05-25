<template>
  <div id="NextRun" :style="{ fontSize: '40px' }" v-html="msg"></div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { $ref } from 'vue/macros';
  import {
    RunData,
    RunDataActiveRun,
    RunDataArray,
  } from '../../../../../../nodecg-speedcontrol/src/types';
  import { timeToRun } from '../../../_misc/time-to-run';
  import { formatPlayers } from '../../../_misc/format-players';
  const activeRun = nodecg.Replicant<RunDataActiveRun>(
    'runDataActiveRun',
    'nodecg-speedcontrol'
  );
  const runDataArray = nodecg.Replicant<RunDataArray>(
    'runDataArray',
    'nodecg-speedcontrol'
  );

  const emit = defineEmits(['end']);

  let msg = $ref('');

  function getNextRun(): RunData | null {
    if (runDataArray.value && activeRun.value) {
      const activeRunId = activeRun.value.id;
      if (activeRunId) {
        const activeRunIndex = runDataArray.value.findIndex(
          (run) => run.id === activeRunId
        );
        return runDataArray.value[activeRunIndex + 1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  onMounted(() => {
    setTimeout(() => {
      const nextRun = getNextRun();
      if (nextRun) {
        msg = `Next run in <span class="highlight">${timeToRun(nextRun)}</span> - ${nextRun.game} ${
          nextRun.category
        } by <span class="highlight">${formatPlayers(nextRun)}</span>`;
      } else {
        emit('end');
      }
    }, 200);

    console.log('NextRun: Mounted');
    setTimeout(() => {
      emit('end');
      console.log('NextRun: ended');
    }, 20 * 1000);
  });
</script>
