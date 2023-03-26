<template>
  <div :style="{ position: 'fixed' }">
    <transition name="fade">
      <div
        v-if="activeRun && activeRun.data"
        :key="`${activeRun.data.customData.gameShort}`"
        class="Flex"
        :style="{
          position: 'absolute',
          'flex-direction': 'column',
          'font-size': '1em',
        }"
      >
        <div
          v-if="activeRun && activeRun.data"
          :style="{ 'font-size': `1.3em` }"
          ref="game"
        >
          {{ activeRun.data.customData.gameShort }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import fitty, { FittyInstance } from 'fitty';
  import { ref, watch } from 'vue';
  import { RunDataActiveRun } from 'nodecg/bundles/nodecg-speedcontrol/src/types';
  import { useReplicant } from 'nodecg-vue-composable';

  interface Props {
    size: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 64,
  });

  const activeRun = useReplicant<RunDataActiveRun>(
    'runDataActiveRun',
    'nodecg-speedcontrol'
  );
  const game = ref<HTMLDivElement | null>(null);
  let gameFitty: FittyInstance | undefined = undefined;

  function fit() {
    if (game.value) {
      gameFitty = fitty(game.value, {
        maxSize: props.size,
        minSize: 1,
        multiLine: true,
      });
    }
  }

  watch(
    () => activeRun?.data,
    () => {
      setTimeout(() => {
        fit();
      }, 500);
    },
    { immediate: true }
  );
</script>
