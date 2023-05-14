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
    <div
      id="MediaBoxContainer"
      v-if="currentComponent && currentComponent.data"
      :style="{ width: '100%', height: '100%', margin: 'auto' }"
    >
      <transition name="fade" mode="out-in" appear>
        <div :key="timestamp">
          <media-box-image
            v-if="currentComponent.data.type === 'image'"
            :image="currentComponent.data.data"
            :use-widescreen="useWidescreenImages"
          />
          <merch-alert
            v-else-if="currentComponent.data.type === 'merch'"
            :merch-info="currentComponent.data.data"
          />
          <twitch-bits
            v-else-if="currentComponent.data.type === 'cheer'"
            :bits-info="currentComponent.data.data"
          />
          <twitch-sub
            v-else-if="currentComponent.data.type === 'sub'"
            :sub-info="currentComponent.data.data"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { $ref } from 'vue/macros';
  import { defineProps, watch } from 'vue';
  import { useReplicant } from 'nodecg-vue-composable';
  import { MediaBoxItem } from '@gtam-layouts/types';
  import MediaBoxImage from './MediaBox/Image.vue';
  import MerchAlert from './MediaBox/MerchAlert.vue';
  import TwitchBits from './MediaBox/TwitchBits.vue';
  import TwitchSub from './MediaBox/TwitchSub.vue';

  // set up data
  const props = defineProps({ useWidescreenImages: Boolean });
  const currentComponent = useReplicant<MediaBoxItem>(
    'currentMediaBoxItem',
    'gtam-layouts'
  );
  let timestamp = $ref<number>(Date.now());

  watch(
    () => currentComponent?.data,
    () => {
      timestamp = Date.now();
    }
  );
</script>
