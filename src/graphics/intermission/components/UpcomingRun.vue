<template>
  <div :style="{ position: 'fixed' }">
    <transition name="fade" mode="out-in" appear>
      <div v-if="!run" class="Flex" :style="{ 'font-size': '3em' }"></div>
      <div
        v-else
        :key="run.id"
        class="Flex"
        :style="{
          'padding-left': '15px',
          'padding-right': '15px',
          'font-size': bigFontSize + 'px',
          width: bigWidth + 'px',
        }"
      >
        <div
          :style="{
            'flex-direction': 'column',
            'text-align': 'left',
            'align-items': 'normal',
          }"
        >
          <div
            id="game"
            ref="game"
            :style="{
              'font-size': '1em',
              width: bigWidth + 'px',
              marginBottom: '-5px',
            }"
          >
            {{ run.game }}
          </div>
          <div
            id="category"
            ref="category"
            :style="{
              'font-size': catRatio + 'em',
              width: bigWidth + 'px',
              /* color: '#4fbafe', */
            }"
          >
            {{ run.category }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { RunData } from 'nodecg/bundles/nodecg-speedcontrol/src/types';
  import fitty, { FittyInstance } from 'fitty';

  interface Props {
    run: RunData | null;
  }

  const props = withDefaults(defineProps<Props>(), {
    run: null,
  });

  const game = ref<HTMLDivElement | null>(null);
  const category = ref<HTMLDivElement | null>(null);
  let bigFontSize = 48;
  let bigWidth = 872;
  let catRatio = 0.75;
  let minSizeRatio = 0.4;
  let gameFitty: FittyInstance | undefined = undefined;
  let categoryFitty: FittyInstance | undefined = undefined;

  function fit() {
    if (game.value) {
      gameFitty = fitty(game.value, {
        maxSize: bigFontSize,
        minSize: bigFontSize * minSizeRatio,
        multiLine: false,
      });
    }
    if (category.value) {
      categoryFitty = fitty(category.value, {
        maxSize: bigFontSize * catRatio,
        minSize: bigFontSize * minSizeRatio * catRatio,
        multiLine: false,
      });
    }
  }

  onMounted(() => {
    setTimeout(() => {
      fit();
    }, 550);
  });

  watch(
    () => props.run,
    () => {
      setTimeout(() => {
        fit();
      }, 550);
    }
  );
</script>

<style scoped>
  .Flex {
    flex-direction: column;
    text-align: left;
    align-items: normal;
  }
</style>
