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
          id="game"
        >
          {{ activeRun.data.customData.gameShort || activeRun.data.game }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { watch } from 'vue';
  import { $ref } from 'vue/macros';
  import { RunDataActiveRun } from 'speedcontrol/types';
  import { useReplicant } from 'nodecg-vue-composable';
  import fitty, { FittyInstance } from 'fitty';

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
  const game = $ref<HTMLDivElement | null>(null);
  let gameFitty: FittyInstance | undefined = undefined;

  watch(
    () => activeRun?.data,
    () => {
      setTimeout(() => {
        if (game) {
          gameFitty = fitty(game, {
            maxSize: props.size,
            minSize: 1,
            multiLine: true,
          });
        }
      }, 500);
    },
    { immediate: true }
  );
</script>
