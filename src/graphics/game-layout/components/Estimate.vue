<template>
  <div class="Flex" :style="{ position: 'fixed' }">
    <div
      id="Time"
      v-if="activeRun && activeRun.data && activeRun.data.estimate"
      :style="{
        'font-size': '1.8em',
        'margin-bottom': '-0.2em',
      }"
    >
      EST: {{ activeRun.data.estimate }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { RunDataActiveRun } from 'nodecg/bundles/nodecg-speedcontrol/src/types';
  import { nextTick, watch } from 'vue';
  import { $ref } from 'vue/macros';
  import { useReplicant } from 'nodecg-vue-composable';

  const activeRun = useReplicant<RunDataActiveRun>(
    'runDataActiveRun',
    'nodecg-speedcontrol'
  );
  const estimate = $ref<HTMLElement | null>(null);
  let estimateWidth = $ref('0px');

  watch(
    () => activeRun?.data,
    (newValue, oldValue) => {
      if (!oldValue && newValue) {
        nextTick().then(() => {
          if (estimate) {
            estimateWidth = `${estimate.clientWidth}px`;
          }
        });
      }
    },
    { immediate: true }
  );
</script>

<style scoped>
  .Flex {
    flex-direction: column;
  }
</style>
