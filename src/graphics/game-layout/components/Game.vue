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
          {{ activeRun.data.customData.gameShort }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { RunDataActiveRun } from 'nodecg/bundles/nodecg-speedcontrol/src/types';
  import { useReplicant } from 'nodecg-vue-composable';
  import BigText from 'big-text.ts';

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

  watch(
    () => activeRun?.data,
    () => {
      setTimeout(() => {
        if (game.value) {
          BigText(game.value, {
            maximumFontSize: props.size,
          });
        }
      }, 20);
    },
    { immediate: true }
  );
</script>
