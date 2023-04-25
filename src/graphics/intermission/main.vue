<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./bgs/mediabox-logo.png" />
      <img class="bg" src="./bgs/intermissionnameblob.png" />
      <img
        class="bg"
        v-if="intermissionRunData.length === 1"
        src="./bgs/1box.png"
      />
      <img
        class="bg"
        v-else-if="intermissionRunData.length === 2"
        src="./bgs/2box.png"
      />
      <img
        class="bg"
        v-else-if="intermissionRunData.length === 3"
        src="./bgs/3box.png"
      />
      <img
        class="bg"
        v-if="type == 'START OF MARATHON' || type == 'START OF DAY'"
        src="./labels/stream_starting.png"
      />
      <img
        class="bg"
        v-else-if="type == 'END OF DAY'"
        src="./labels/stream_ending.png"
      />
      <img
        class="bg"
        v-else-if="type == 'INTERMISSION' || type == 'FINAL RUN'"
        src="./labels/intermission.png"
      />
      <img
        class="bg"
        v-else-if="type == 'END OF MARATHON'"
        src="./background_end_marathon.png"
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
          left: '280px'
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
            color: '#4fbafe',
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
          left: '430px'
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
            color: '#4fbafe',
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
          left: '225px'
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
            color: '#4fbafe',
          }"
          :key="intermissionRunData[2].run.id"
        >
          {{ formatPlayers(intermissionRunData[2].run) }}
        </p>
      </transition>
    </div>

    <media-box
      :style="{
        right: '115px',
        bottom: '80px',
        width: '632px',
        height: '674px',
        fontSize: '44px',
      }"
    />
  </div>
</template>

<script setup lang="ts">
  import { RunData } from 'nodecg/bundles/nodecg-speedcontrol/src/types';
  import {
    RunDataActiveRunSurrounding,
    RunDataArray,
  } from 'nodecg/bundles/nodecg-speedcontrol/src/types/schemas';
  import UpcomingRun from './components/UpcomingRun.vue';
  import MediaBox from '../game-layout/components/MediaBox.vue';
  import humanizeDuration from 'humanize-duration';
  import { onMounted, watch } from 'vue';
  import { $ref } from 'vue/macros';
  import { useReplicant } from 'nodecg-vue-composable';

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

  onMounted(() => {
    update();
    nodecg.listenFor('endOfMarathon', () => {
      type = 'END OF MARATHON';
      intermissionRunData = [];
    });
    nodecg.listenFor('clearIntermission', () => {
      clear();
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
    }
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
