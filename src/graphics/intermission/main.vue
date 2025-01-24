<template>
  <div>
    <div id="backgrounds">
      <img
        class="bg"
        style="z-index: 10"
        v-if="type != 'END OF MARATHON'"
        src="./bgs/mediabox-logo.png"
      />
      <img class="bg" v-if="type != 'END OF MARATHON'" src="./bgs/fade.png" />
      <template v-if="type != 'END OF MARATHON'">
        <transition name="fade" appear>
          <img
            class="bg"
            v-if="intermissionRunData.length === 1"
            src="./bgs/1box.png"
            rel="preload"
          />
          <img
            class="bg"
            v-else-if="intermissionRunData.length === 2"
            src="./bgs/2box.png"
            rel="preload"
          />
          <img class="bg" v-else src="./bgs/3box.png" rel="preload" />
        </transition>
      </template>
      <img
        class="bg"
        v-show="type == 'START OF MARATHON' || type == 'START OF DAY'"
        src="./labels/stream_starting.png"
        rel="preload"
      />
      <img
        class="bg"
        v-show="type == 'END OF DAY'"
        src="./labels/stream_ending.png"
        rel="preload"
      />
      <img
        class="bg"
        v-show="type == 'INTERMISSION' || type == 'FINAL RUN'"
        src="./labels/intermission.png"
        rel="preload"
      />
      <img
        class="bg"
        v-show="type == 'END OF MARATHON'"
        src="./bgs/marathonend.png"
        rel="preload"
      />
    </div>

    <div
      :style="{
        position: 'fixed',
        left: '0px',
        top: '0px',
      }"
    ></div>

    <div
      v-if="intermissionRunData[0]"
      :style="{
        position: 'fixed',
        top: '239px',
        left: '86px',
        height: '200px',
        width: '887px',
      }"
    >
      <p
        :style="{
          lineHeight: '5px',
          fontFamily: 'slope_operaregular',
          fontSize: '30px',
          overflow: 'visible',
          whiteSpace: 'nowrap',
          position: 'absolute',
          top: '0px',
          left: '280px',
        }"
      >
        {{ intermissionRunData[0].etaUntil }}
      </p>
      <upcoming-run
        :run="intermissionRunData[0].run"
        :style="{
          position: 'absolute',
          top: '65px',
          height: '102px',
          width: '887px',
          lineHeight: '40px',
        }"
      />
      <transition name="fade" mode="out-in" appear>
        <p
          :style="{
            position: 'absolute',
            top: '35px',
            lineHeight: '5px',
            fontFamily: 'slope_operaregular',
            fontSize: '30px',
            overflow: 'visible',
            whiteSpace: 'nowrap',
            marginTop: '160px',
            color: '#C736FF',
          }"
          :key="intermissionRunData[0].run.id"
        >
          {{ formatPlayers(intermissionRunData[0].run) }}
        </p>
      </transition>
    </div>

    <div
      v-if="intermissionRunData[1]"
      :style="{
        position: 'fixed',
        top: '530px',
        left: '86px',
        height: '200px',
        width: '887px',
      }"
    >
      <p
        :style="{
          lineHeight: '5px',
          fontFamily: 'slope_operaregular',
          fontSize: '30px',
          overflow: 'visible',
          whiteSpace: 'nowrap',
          position: 'absolute',
          top: '0px',
          left: '430px',
        }"
      >
        {{ intermissionRunData[1].etaUntil }}
      </p>
      <upcoming-run
        :run="intermissionRunData[1].run"
        :style="{
          position: 'absolute',
          top: '65px',
          height: '102px',
          width: '887px',
          lineHeight: '40px',
        }"
      />
      <transition name="fade" mode="out-in" appear>
        <p
          :style="{
            position: 'absolute',
            top: '35px',
            lineHeight: '5px',
            fontFamily: 'slope_operaregular',
            fontSize: '30px',
            overflow: 'visible',
            whiteSpace: 'nowrap',
            marginTop: '160px',
            color: '#C736FF',
          }"
          :key="intermissionRunData[1].run.id"
        >
          {{ formatPlayers(intermissionRunData[1].run) }}
        </p>
      </transition>
    </div>

    <div
      v-if="intermissionRunData[2]"
      :style="{
        position: 'fixed',
        top: '820px',
        left: '86px',
        height: '200px',
        width: '887px',
      }"
    >
      <p
        :style="{
          lineHeight: '5px',
          fontFamily: 'slope_operaregular',
          fontSize: '30px',
          overflow: 'visible',
          whiteSpace: 'nowrap',
          position: 'absolute',
          top: '0px',
          left: '225px',
        }"
      >
        {{ intermissionRunData[2].etaUntil }}
      </p>
      <upcoming-run
        :run="intermissionRunData[2].run"
        :style="{
          position: 'absolute',
          top: '65px',
          height: '102px',
          width: '887px',
          lineHeight: '40px',
        }"
      />
      <transition name="fade" mode="out-in" appear>
        <p
          :style="{
            position: 'absolute',
            top: '35px',
            lineHeight: '5px',
            fontFamily: 'slope_operaregular',
            fontSize: '30px',
            overflow: 'visible',
            whiteSpace: 'nowrap',
            marginTop: '160px',
            color: '#C736FF',
          }"
          :key="intermissionRunData[2].run.id"
        >
          {{ formatPlayers(intermissionRunData[2].run) }}
        </p>
      </transition>
    </div>

    <media-box
      :style="{
        right: '125.5px',
        bottom: '87px',
        width: '637px',
        height: '686px',
        fontSize: '44px',
      }"
      v-if="type != 'END OF MARATHON'"
      :sponsor-images="sponsorImages"
      :merch-images="merchImages"
    />

    <transition name="fade" mode="out-in" appear>
      <div
        v-if="
          twitchCommercialTimer &&
          twitchCommercialTimer.data &&
          twitchCommercialTimer.data.secondsRemaining > 0 &&
          type != 'END OF MARATHON'
        "
        :style="{
          position: 'absolute',
          fontSize: '36px',
          right: '109px',
          bottom: '15px',
          width: '670px',
          height: '60px',
          textAlign: 'center',
        }"
      >
        Ads are running:
        <span :style="{ color: '#4fbafe' }">{{ adTimer }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { RunData } from 'speedcontrol/types';
  import {
    RunDataActiveRunSurrounding,
    RunDataArray,
    TwitchCommercialTimer,
  } from 'speedcontrol/types/schemas';
  import UpcomingRun from './components/UpcomingRun.vue';
  import MediaBox from '../game-layout/components/MediaBox.vue';
  import humanizeDuration from 'humanize-duration';
  import { onMounted, watch } from 'vue';
  import { $computed, $ref } from 'vue/macros';
  import { useReplicant, useAssetReplicant } from 'nodecg-vue-composable';

  const twitchCommercialTimer = useReplicant<TwitchCommercialTimer>(
    'twitchCommercialTimer',
    'nodecg-speedcontrol'
  );
  const sponsorImages = useAssetReplicant('sponsor-logos', 'gtam-layouts');
  const merchImages = useAssetReplicant('merch-images', 'gtam-layouts');

  type IntermissionType =
    | 'START OF MARATHON'
    | 'INTERMISSION'
    | 'END OF DAY'
    | 'START OF DAY'
    | 'FINAL RUN'
    | 'END OF MARATHON'
    | null;

  type IntermissionRunData = {
    run: RunData;
    etaUntil: string;
  };

  let type = $ref<IntermissionType>(null);
  let intermissionRunData = $ref<IntermissionRunData[]>([]);
  const runDataArray = useReplicant<RunDataArray>(
    'runDataArray',
    'nodecg-speedcontrol'
  );
  const runDataActiveRun = useReplicant<RunData>(
    'runDataActiveRun',
    'nodecg-speedcontrol'
  );
  const runDataActiveRunSurrounding = useReplicant<RunDataActiveRunSurrounding>(
    'runDataActiveRunSurrounding',
    'nodecg-speedcontrol'
  );
  const adTimer = $computed(() => {
    if (
      twitchCommercialTimer &&
      twitchCommercialTimer.data &&
      twitchCommercialTimer.data.secondsRemaining
    ) {
      return timeFormat(twitchCommercialTimer.data.secondsRemaining);
    } else {
      return '';
    }
  });

  let timeRefreshTimeout: NodeJS.Timeout;

  onMounted(() => {
    update();
    nodecg.listenFor('endOfMarathon', () => {
      type = 'END OF MARATHON';
      intermissionRunData = [];
      clearTimeout(timeRefreshTimeout);
    });
    nodecg.listenFor('clearIntermission', () => {
      clear();
      clearTimeout(timeRefreshTimeout);
    });
  });

  function clear() {
    intermissionRunData = [];
    type = null;
  }

  function update() {
    clear();
    if (
      runDataActiveRun &&
      runDataActiveRun.data &&
      runDataActiveRunSurrounding &&
      runDataActiveRunSurrounding.data &&
      runDataArray &&
      runDataArray.data &&
      runDataArray.data.length
    ) {
      // if current run is stream offline, set type to end of day and get next 3 runs
      if (runDataActiveRun.data.gameTwitch === 'Just Chatting') {
        type = 'END OF DAY';
        const index = runDataArray?.data?.findIndex(
          (run) => run.id === runDataActiveRunSurrounding.data?.next
        );
        if (index != undefined) {
          let runDataIndex = 0;
          for (let i = index; i < index + 3; i++) {
            const run = runDataArray!.data![i];
            if (run) {
              // if we hit a stream offline run, cut the loop early
              if (run.gameTwitch === 'Just Chatting') {
                break;
              }
              intermissionRunData[runDataIndex] = {
                run,
                etaUntil: timeToRun(run),
              };
              runDataIndex++;
            }
          }
        }
      } else {
        // if current run is first run in the schedule, set 'start of marathon' type
        type = 'INTERMISSION';
        if (!runDataActiveRunSurrounding.data.previous) {
          type = 'START OF MARATHON';
        } else {
          // if previous run is stream offline, set type to 'start of day'
          const previousRun = runDataArray.data.find(
            (run) => run.id === runDataActiveRunSurrounding.data?.previous
          );
          if (previousRun && previousRun.gameTwitch === 'Just Chatting') {
            type = 'START OF DAY';
          } else {
            type = 'INTERMISSION';
          }
        }
        // if current run is last in schedule, set type to 'final run'
        if (
          runDataActiveRun.data.id ===
          runDataArray.data[runDataArray.data.length - 1].id
        ) {
          type = 'FINAL RUN';
        }
        const index = runDataArray.data.findIndex(
          (run) => run.id === runDataActiveRunSurrounding.data?.current
        );
        if (index != undefined) {
          let runDataIndex = 0;
          for (let i = index; i < index + 3; i++) {
            const run = runDataArray!.data![i];
            if (run) {
              // if we hit a stream offline run, cut the loop early
              if (run.gameTwitch === 'Just Chatting') {
                break;
              }
              intermissionRunData[runDataIndex] = {
                run,
                etaUntil: timeToRun(run),
              };
              runDataIndex++;
            }
          }
        }
      }
      timeRefreshTimeout = setTimeout(updateRunTimes, 30 * 1000); // Update relative run timestamps every 30 seconds
    }
  }

  function updateRunTimes() {
    for (let index = 0; index < intermissionRunData.length; index++) {
      const run = intermissionRunData[index];
      if (run && run.run) {
        intermissionRunData[index] = {
          run: run.run,
          etaUntil: timeToRun(run.run),
        };
      }
    }
    timeRefreshTimeout = setTimeout(updateRunTimes, 30 * 1000);
    console.log('Updating run times');
  }

  function timeToRun(run: RunData): string {
    let value = '';
    if (run.scheduledS) {
      var now = Math.floor(Date.now() / 1000);
      var timerS = run.scheduledS - now;
      if (timerS > 30) {
        var roundedS = customizedRounding(timerS);
        value =
          ' in ' +
          humanizeDuration(roundedS * 1000, {
            conjunction: ' and ',
            serialComma: false,
            units: ['d', 'h', 'm'],
          });
      }
    }
    return value;
  }

  function customizedRounding(time: number): number {
    var rounded: number;
    if (time < 300) {
      rounded = Math.round(time / 60) * 60;
    } else if (time < 3600) {
      rounded = Math.round(time / 300) * 300;
    } else if (time < 7200) {
      var round10 = Math.round(time / 600) * 600;
      var round15 = Math.round(time / 900) * 900;
      rounded =
        Math.abs(round10 - time) < Math.abs(round15 - time) ? round10 : round15;
    } else if (time < 14400) {
      rounded = Math.round(time / 900) * 900;
    } else if (time < 21600) {
      rounded = Math.round(time / 1800) * 1800;
    } else {
      rounded = Math.round(time / 3600) * 3600;
    }
    return rounded;
  }

  function formatPlayers(run: RunData) {
    return (
      run.teams
        .map(
          (team) =>
            team.name || team.players.map((player) => player.name).join(', ')
        )
        .join(' vs. ') || 'No Player(s)'
    );
  }

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

  watch(
    () => runDataActiveRunSurrounding?.data,
    () => {
      update();
    }
  );

  // if no current run set, clear the intermission
  watch(
    () => runDataActiveRun?.data,
    (newVal) => {
      if (!newVal) clear();
    },
    { immediate: true }
  );
</script>

<style>
  @import url('../_misc/common.css');
  @import url('../_misc/Fade.css');
  @import url('../_misc/Flex.css');

  .Flex {
    flex-direction: column;
  }
</style>
