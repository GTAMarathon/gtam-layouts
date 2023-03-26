<template>
  <div class="Flex" :style="{ position: 'fixed' }">
    <div
      v-if="activeRun && activeRun.data"
      :style="{
        'font-size': '1.6em',
        display: 'flex',
        'flex-direction': 'row',
        'justify-content': 'center',
        width: '100%',
      }"
    >
      <div :style="{ 'margin-left': '5px', width: estimateWidth }">
        <transition name="fade">
          <div
            id="Estimate"
            ref="estimate"
            :key="`${activeRun.data.id}${activeRun.data.estimate}`"
            :style="{ position: 'absolute' }"
          >
            <span
              v-if="activeRun.data.estimate"
              v-for="char in activeRun.data.estimate.split('')"
              :key="`${Math.random()}${char}`"
              :class="char === ':' ? 'Colon' : undefined"
            >
              {{ char }}
            </span>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { RunDataActiveRun } from 'nodecg/bundles/nodecg-speedcontrol/src/types';
  import { nextTick, ref, watch } from 'vue';
  import { useReplicant } from 'nodecg-vue-composable';

  const activeRun = useReplicant<RunDataActiveRun>(
    'runDataActiveRun',
    'nodecg-speedcontrol'
  );
  const estimate = ref<HTMLElement | null>(null);
  let estimateWidth = ref('0px');

  watch(
    () => activeRun?.data,
    (newValue, oldValue) => {
      if (!oldValue && newValue) {
        nextTick().then(() => {
          if (estimate.value) {
            estimateWidth.value = `${estimate.value.clientWidth}px`;
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

  #Estimate > span {
    display: inline-block;
    width: 0.5em;
    text-align: center;
  }
  #Estimate > .Colon {
    width: 0.3em;
  }
</style>
