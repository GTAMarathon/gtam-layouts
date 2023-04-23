<template>
  <div id="MediaBox">
    <transition name="fade" mode="out-in" appear>
      <component
        :is="currentComponent.name"
        :key="timestamp"
        :data="currentComponent.data"
        @end="setNextStage"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { $ref } from 'vue/macros';
  import { defineAsyncComponent, markRaw, onMounted } from 'vue';
  import { useAssetReplicant, useReplicant } from 'nodecg-vue-composable';
  import { SubQueueItem, BitsQueueItem } from '@gtam-layouts/types';

  type MediaBoxStages =
    | 'MerchImage'
    | 'SponsorImage'
    | 'TwitchSub'
    | 'TwitchBits';

  let lastStage: MediaBoxStages;
  let timestamp = $ref<number>(Date.now());
  const components = {
    Image: markRaw(
      defineAsyncComponent(() => import('./MediaBox/MediaBoxImage.vue'))
    ),
  };
  let currentComponent = $ref({
    name: components.Image,
    data: {},
  });
  const sponsorImages = useAssetReplicant('sponsor-logos', 'gtam-layouts');
  const merchImages = useAssetReplicant('merch-images', 'gtam-layouts');
  const twitchSubsQueue = useReplicant<SubQueueItem[]>(
    'twitchSubQueue',
    'gtam-layouts'
  );
  const twitchBitsQueue = useReplicant<BitsQueueItem[]>(
    'twitchBitsQueue',
    'gtam-layouts'
  );

  function setNextStage(): void {
    timestamp = Date.now();

    // if there was no last stage, start from the beginning
    if (lastStage) {
      if (lastStage === 'MerchImage') {
        currentComponent = sponsorImage();
        return;
      } else if (lastStage === 'SponsorImage') {
        /*         if (twitchSubsQueue?.data && twitchSubsQueue.data.length) {
          lastStage = 'TwitchSub';
          return;
        } else if (twitchBitsQueue?.data && twitchBitsQueue.data.length) {
          lastStage = 'TwitchBits';
          return;
        } else {
          currentComponent = merchImage();
          return;
        } */
        currentComponent = merchImage();
        return;
      }
    } else {
      currentComponent = merchImage();
    }
  }

  function merchImage() {
    lastStage = 'MerchImage';
    return {
      name: components.Image,
      data: {
        image:
          merchImages.value[
            Math.floor(Math.random() * merchImages.value.length)
          ],
      },
    };
  }

  function sponsorImage() {
    lastStage = 'SponsorImage';
    return {
      name: components.Image,
      data: {
        image:
          sponsorImages.value[
            Math.floor(Math.random() * merchImages.value.length)
          ],
      },
    };
  }

  onMounted(() => {
    // a bit of a hack, but it works
    setTimeout(() => {
      if (merchImages && merchImages.value) {
        setNextStage();
      }
    }, 500);
  });
</script>

<style scoped>
  #MediaBox {
    margin: 15px;
    width: 100%;
    height: 100%;
    object-fit: contain;
    vertical-align: middle;
    position: fixed;
  }
</style>
