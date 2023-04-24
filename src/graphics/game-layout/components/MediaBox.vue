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
  import {
    SubQueueItem,
    BitsQueueItem,
    MerchQueueItem,
  } from '@gtam-layouts/types';

  type MediaBoxStages = 'MerchImage' | 'SponsorImage';

  let lastStage: MediaBoxStages;
  let timestamp = $ref<number>(Date.now());
  const components = {
    imports: {
      Image: markRaw(
        defineAsyncComponent(() => import('./MediaBox/Image.vue'))
      ),
      TwitchSub: markRaw(
        defineAsyncComponent(() => import('./MediaBox/TwitchSub.vue'))
      ),
      TwitchBits: markRaw(
        defineAsyncComponent(() => import('./MediaBox/TwitchBits.vue'))
      ),
    },
    functions: {
      TwitchSub: () => {
        const subInfo = twitchSubsQueue!.data!.shift();
        // save modified array to replicant
        twitchSubsQueue?.save();
        return {
          name: components.imports.TwitchSub,
          data: {
            subInfo: {
              name: subInfo!.name,
              months: subInfo!.months,
              tier: subInfo!.tier,
            },
          },
        };
      },
      TwitchBits: () => {
        const bitsInfo = twitchBitsQueue!.data!.shift();
        twitchBitsQueue?.save();
        return {
          name: components.imports.TwitchBits,
          data: {
            bitsInfo: {
              name: bitsInfo!.name,
              amount: bitsInfo!.amount,
            },
          },
        };
      },
      SponsorImage: () => {
        lastStage = 'SponsorImage';
        return {
          name: components.imports.Image,
          data: {
            image:
              sponsorImages.value[
                Math.floor(Math.random() * merchImages.value.length)
              ],
          },
        };
      },
      MerchImage: () => {
        lastStage = 'MerchImage';
        return {
          name: components.imports.Image,
          data: {
            image:
              merchImages.value[
                Math.floor(Math.random() * merchImages.value.length)
              ],
          },
        };
      },
    },
    checks: {
      IsTwitchSubQueued: () => {
        if (
          twitchSubsQueue &&
          twitchSubsQueue.data &&
          twitchSubsQueue.data.length
        ) {
          return true;
        } else {
          return false;
        }
      },
      IsTwitchBitsQueued: () => {
        if (
          twitchBitsQueue &&
          twitchBitsQueue.data &&
          twitchBitsQueue.data.length
        ) {
          return true;
        } else {
          return false;
        }
      },
      IsMerchPurchaseQueued: () => {
        if (
          merchPurchaseQueue &&
          merchPurchaseQueue.data &&
          merchPurchaseQueue.data.length
        ) {
          return true;
        } else {
          return false;
        }
      },
    },
  };

  // current component object
  // using any here is a massive hack, but it works
  let currentComponent = $ref<{ name: any; data: {} }>({
    name: '',
    data: {},
  });

  // set up replicants
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
  const merchPurchaseQueue = useReplicant<MerchQueueItem[]>(
    'merchPurchaseQueue',
    'gtam-layouts'
  );

  function setNextStage(): void {
    timestamp = Date.now();

    // if there was no last stage, start from the beginning
    if (lastStage) {
      if (components.checks.IsTwitchSubQueued()) {
        currentComponent = components.functions.TwitchSub();
        return;
      } else if (components.checks.IsTwitchBitsQueued()) {
        currentComponent = components.functions.TwitchBits();
        return;
      } else if (components.checks.IsMerchPurchaseQueued()) {
        return;
      } else if (lastStage === 'MerchImage') {
        currentComponent = components.functions.SponsorImage();
        return;
      } else if (lastStage === 'SponsorImage') {
        currentComponent = components.functions.MerchImage();
        return;
      }
    } else {
      currentComponent = components.functions.MerchImage();
      return;
    }
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
