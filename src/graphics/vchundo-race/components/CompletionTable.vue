<template>
  <div :style="{ position: 'fixed' }">
    <table class="table table-bordered">
      <player-completion
        v-if="hundoTrackerData && hundoTrackerData.data"
        v-for="(player, i) in hundoTrackerData.data"
        :player="player"
        :position="i + 1"
        :key="player.name"
      />
    </table>
  </div>
</template>

<script setup lang="ts">
  import type { HundoTrackerData } from '@gtam-layouts/types/schemas';
  import { useReplicant } from 'nodecg-vue-composable';
  import PlayerCompletion from './CompletionTable/PlayerCompletion.vue';

  const hundoTrackerData = useReplicant<HundoTrackerData>(
    'hundoTrackerData',
    'gtam-layouts'
  );
</script>
