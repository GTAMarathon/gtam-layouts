<template>
  <div>
    <div class="q-pa-sm" :style="{ fontSize: '24px' }">
      <div v-if="twitchCommercialTimer && twitchCommercialTimer.data">
        <p
          v-if="twitchCommercialTimer.data?.secondsRemaining > 0"
          :style="{ color: 'red' }"
        >
          <b
            >ADS ARE STILL RUNNING FOR
            {{ timeFormat(twitchCommercialTimer.data.secondsRemaining) }}!</b
          >
        </p>
        <p v-else :style="{ color: 'green' }">
          <b>Ads are not running, you're good to go!</b>
        </p>
      </div>
      <div v-else>
        <p :style="{ color: 'green' }">
          <b>Ads are not running, you're good to go!</b>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useHead } from '@vueuse/head';
  import { useReplicant } from 'nodecg-vue-composable';
  import { TwitchCommercialTimer } from '../../../../nodecg-speedcontrol/src/types/schemas';

  useHead({ title: 'Twitch Ad Reminder' });

  const twitchCommercialTimer = useReplicant<TwitchCommercialTimer>(
    'twitchCommercialTimer',
    'nodecg-speedcontrol'
  );

  function timeFormat(duration: number): string {
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = '';

    if (hrs > 0) {
      ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }

    ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;

    return ret;
  }
</script>
