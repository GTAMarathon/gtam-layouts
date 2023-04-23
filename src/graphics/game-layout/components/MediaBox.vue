<template>
  <div id="MediaBox">
    <transition name="fade" mode="out-in">
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

  type MediaBoxStages =
    | 'MerchImage'
    | 'SponsorImage'
    | 'TwitchSub'
    | 'TwitchBits';

  let lastStage = $ref<MediaBoxStages | null>(null);
  let timestamp = $ref<number>(Date.now());
  let currentComponent = $ref({
    name: '',
    data: {},
  });

  function setNextStage(): void {}
</script>
