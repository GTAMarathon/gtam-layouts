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
            id="game"
            ref="game"
            :style="{
              'font-size': '1em',
              width: small ? smallWidth + 'px' : bigWidth + 'px',
            }"
          >
            {{ run.game }}
          </div>
          <div
            id="category"
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
  import { onMounted, ref, watch } from 'vue';
  import { RunData } from 'nodecg/bundles/nodecg-speedcontrol/src/types';
  import BigText from 'big-text.ts';

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
  let smallFontSize = 60;
  let bigFontSize = 80;
  let smallWidth = 944;
  let bigWidth = 1284;
  let catRatio = 0.75;
  let minSizeRatio = 0.4;

  function fit() {
    if (game.value) {
      BigText(game.value, {
        maximumFontSize: props.small ? smallFontSize : bigFontSize,
        textAlign: 'left',
      });
    }
    if (category.value) {
      BigText(category.value, {
        maximumFontSize: props.small
          ? smallFontSize * catRatio
          : bigFontSize * catRatio,
        textAlign: 'left',
      });
    }
  }

  onMounted(() => {
    setTimeout(() => {
      fit();
    }, 50);
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
