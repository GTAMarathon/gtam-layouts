<template>
  <div :style="{ position: 'fixed' }">
    <transition name="fade">
      <div v-if="!run" class="Flex" :style="{ 'font-size': '3em' }"></div>
      <div
        v-else
        :key="run.id"
        class="Flex"
        :style="{
          'padding-left': '20px',
          'padding-right': '20px',
          'font-size': small ? smallFontSize + 'px' : bigFontSize + 'px',
          width: small ? smallWidth + 'px' : bigWidth + 'px',
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
            ref="game"
            :style="{
              'font-size': '1em',
              width: small ? smallWidth + 'px' : bigWidth + 'px',
            }"
          >
            {{ run.game }}
          </div>
          <div
            ref="category"
            :style="{
              'font-size': catRatio + 'em',
              width: small ? smallWidth + 'px' : bigWidth + 'px',
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
  import fitty, { FittyInstance } from 'fitty';
  import { onMounted, ref, watch } from 'vue';
  import { RunData } from 'nodecg/bundles/nodecg-speedcontrol/src/types';

  interface Props {
    run: RunData | null;
    small: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    run: null,
    small: false,
  });

  const game = ref<HTMLDivElement | null>(null);
  const category = ref<HTMLDivElement | null>(null);
  let gameFitty: FittyInstance | undefined = undefined;
  let categoryFitty: FittyInstance | undefined = undefined;
  let smallFontSize = 60;
  let bigFontSize = 80;
  let smallWidth = 944;
  let bigWidth = 1284;
  let catRatio = 0.75;
  let minSizeRatio = 0.4;

  function fit() {
    if (game.value) {
      gameFitty = fitty(game.value, {
        maxSize: props.small ? smallFontSize : bigFontSize,
        minSize: props.small
          ? smallFontSize * minSizeRatio
          : bigFontSize * minSizeRatio,
        multiLine: true,
      });
    }
    if (category.value) {
      categoryFitty = fitty(category.value, {
        maxSize: props.small
          ? smallFontSize * catRatio
          : bigFontSize * catRatio,
        minSize: props.small
          ? smallFontSize * minSizeRatio * catRatio
          : bigFontSize * minSizeRatio * catRatio,
        multiLine: true,
      });
    }
  }

  onMounted(() => {
    setTimeout(() => {
      fit();
    }, 500);
  });

  watch(
    () => props.run,
    () => {
      setTimeout(() => {
        fit();
      }, 30);
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
