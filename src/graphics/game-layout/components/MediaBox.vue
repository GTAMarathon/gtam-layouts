<template>
  <div
    id="MediaBox"
    :style="{
      margin: '0',
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      verticalAlign: 'middle',
      position: 'fixed',
      '-webkit-box-sizing': 'border-box',
      boxSizing: 'border-box',
      justifyContent: 'center',
      alignItems: 'center',
    }"
    class="Flex"
  >
    <div id="MediaBoxContainer" :style="{ width: '100%', height: '100%', margin: 'auto' }">
      <transition name="fade" mode="out-in" appear>
        <component
          :is="currentComponent.name"
          :key="timestamp"
          :data="currentComponent.data"
          @end="setNextStage"
          @merchEnd="showMerchFollowup"
        />
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { $ref } from 'vue/macros';
  import { defineAsyncComponent, markRaw, onMounted, defineProps } from 'vue';
  import { useReplicant, Asset } from 'nodecg-vue-composable';
  import {
    SubQueueItem,
    BitsQueueItem,
    MerchQueueItem,
  } from '@gtam-layouts/types';

  type MediaBoxStages = 'MerchImage' | 'SponsorImage';

  // set up data
  const props = defineProps<{ sponsorImages: Asset[]; merchImages: Asset[] }>();
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
      MerchAlert: markRaw(
        defineAsyncComponent(() => import('./MediaBox/MerchAlert.vue'))
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
      MerchAlert: () => {
        const merchAlertInfo = merchPurchaseQueue!.data!.shift();
        merchPurchaseQueue?.save();
        return {
          name: components.imports.MerchAlert,
          data: {
            merchInfo: {
              name: merchAlertInfo!.name,
              items: merchAlertInfo!.items,
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
              props.sponsorImages[
                Math.floor(Math.random() * props.sponsorImages.length)
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
              props.merchImages[
                Math.floor(Math.random() * props.merchImages.length)
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
  let currentComponent = $ref<{ name: any; data: {} }>({ name: '', data: {} });

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
        currentComponent = components.functions.MerchAlert();
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

  function showMerchFollowup(): void {
    currentComponent = {
      name: components.imports.Image,
      data: {
        image: {
          name: 'Merch Followup',
          url: new URL('./MediaBox/StoreImage.png', import.meta.url)
            .href,
        },
      },
    };
  }

  onMounted(() => {
    // a bit of a hack, but it works
    setTimeout(() => {
      if (props.merchImages && props.merchImages.length) {
        currentComponent = components.functions.MerchImage();
      }
    }, 500);
  });
</script>
