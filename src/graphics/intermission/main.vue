<template>
  <div>
    <div
      :style="{
        position: 'fixed',
        left: '0px',
        top: '0px',
      }"
    >
      <img
        v-if="type != 'FINAL RUN' && type != 'END OF MARATHON'"
        src="./background_2boxes.png"
      />
      <img v-else-if="type != 'END OF MARATHON'" src="./background_1box.png" />
    </div>

    <div
      :style="{
        position: 'fixed',
        left: '0px',
        top: '0px',
      }"
    >
      <img
        v-if="type == 'START OF MARATHON' || type == 'START OF DAY'"
        src="./background_start.png"
      />
      <img v-else-if="type == 'END OF DAY'" src="./background_end.png" />
      <img
        v-else-if="type == 'INTERMISSION' || type == 'FINAL RUN'"
        src="./background_intermission.png"
      />
      <img
        v-else-if="type == 'END OF MARATHON'"
        src="./background_end_marathon.png"
      />
    </div>

    <div v-if="type != 'END OF MARATHON'">
      <div
        :style="{
          position: 'fixed',
          left: '116px',
          top: '320px',
          'padding-left': '20px',
          'font-size': '80px',
          'font-weight': 'normal',
          'font-family': 'Bebas Neue',
        }"
      >
        {{ upNextTimer }}
      </div>
      <upcoming-run
        :small="false"
        :run="upNext"
        :style="{
          left: '116px',
          top: '410px',
          height: '234px',
        }"
      >
      </upcoming-run>

      <div v-if="type != 'FINAL RUN'">
        <transition name="fade">
          <div
            :key="onDeckTimer"
            :style="{
              position: 'fixed',
              left: '116px',
              top: '739px',
              'padding-left': '20px',
              'font-size': '60px',
              'font-weight': 'normal',
              'font-family': 'Bebas Neue',
            }"
          >
            {{ onDeckTimer }}
          </div>
        </transition>

        <upcoming-run
          :small="true"
          :run="onDeck"
          :style="{
            left: '116px',
            top: '809px',
            height: '185px',
          }"
        >
        </upcoming-run>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { RunData } from 'nodecg/bundles/nodecg-speedcontrol/src/types';
  import {
    RunDataActiveRunSurrounding,
    RunDataArray,
  } from 'nodecg/bundles/nodecg-speedcontrol/src/types/schemas';
  import UpcomingRun from './components/UpcomingRun.vue';
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

  let type = $ref<IntermissionType>(null);
  let upNext = $ref<RunData | null>(null);
  let upNextTimer = $ref('');
  let upNextCountDownCycle = $ref(0);
  let onDeckArr = $ref<RunData[]>([]);
  let onDeck = $ref<RunData | null>(null);
  let onDeckTimer = $ref('');
  let onDeckIndex = $ref(0);
  let onDeckInterval = $ref(0);
  const runDataArray = useReplicant<RunDataArray>(
    'runDataArray',
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
      upNext = null;
      onDeckArr = [];
    });
    nodecg.listenFor('clearIntermission', () => {
      clear();
    });
  });

  function clear() {
    onDeckArr = [];
    upNext = null;
    upNextTimer = 'Next run';
    onDeckTimer = 'Coming up';
    type = null;
  }

  function update() {
    clear();
    let previousRun: RunData | null = null;
    let currentRun: RunData | null = null;
    let nextRun: RunData | null = null;
    if (runDataActiveRunSurrounding && runDataActiveRunSurrounding.data) {
      if (runDataActiveRunSurrounding!.data!.previous) {
        let index = runDataArray!.data!.findIndex(
          (run) => run.id === runDataActiveRunSurrounding!.data!.previous
        );
        previousRun = runDataArray!.data![index];
      }
      if (runDataActiveRunSurrounding!.data!.current) {
        let index = runDataArray!.data!.findIndex(
          (run) => run.id === runDataActiveRunSurrounding!.data!.current
        );
        currentRun = runDataArray!.data![index];
      }
      if (runDataActiveRunSurrounding!.data!.next) {
        let index = runDataArray!.data!.findIndex(
          (run) => run.id === runDataActiveRunSurrounding!.data!.next
        );
        nextRun = runDataArray!.data![index];
      }
    }

    if (!currentRun) {
      if (nextRun) {
        type = 'START OF MARATHON';
        upNext = nextRun;
        let index = runDataArray!.data!.findIndex(
          (run) => run.id === nextRun?.id
        );
        nextRun = runDataArray!.data![index + 1];
      }
    } else if (!previousRun) {
      type = 'START OF MARATHON';
      upNext = currentRun;
    } else if (!nextRun) {
      type = 'FINAL RUN';
      upNext = currentRun;
    } else if (currentRun.gameTwitch == 'Just Chatting') {
      let now = Math.floor(Date.now() / 1000);
      let timerS = (nextRun.scheduledS as number) - now;
      upNext = nextRun;
      updateUpNextTimer();
      let index = runDataArray!.data!.findIndex(
        (run) => run.id === nextRun?.id
      );
      nextRun = runDataArray!.data![index + 1];
      if (timerS > 3600) {
        type = 'END OF DAY';
      } else {
        type = 'START OF DAY';
      }
    } else {
      upNext = currentRun;
      if (previousRun.gameTwitch == 'Just Chatting') {
        type = 'START OF DAY';
        upNextTimer = upNextTimer + timeToRun(upNext);
      } else {
        type = 'INTERMISSION';
      }
    }
    while (nextRun && nextRun.gameTwitch == 'Just Chatting') {
      let index = runDataArray!.data!.findIndex(
        (run) => run.id === nextRun?.id
      );
      nextRun = runDataArray!.data![index + 1];
    }

    if (nextRun) {
      onDeckArr.push(nextRun);
      let index = runDataArray!.data!.findIndex(
        (run) => run.id === nextRun?.id
      );
      onDeckArr = onDeckArr.concat(
        runDataArray!
          .data!.slice(index + 1)
          .filter(
            (run) =>
              run.scheduledS &&
              run.gameTwitch != 'Just Chatting' &&
              run.scheduledS < Math.floor(Date.now() / 1000) + 10800
          )
          .slice(0, 2)
      );
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
          ' in about ' +
          humanizeDuration(roundedS * 1000, {
            conjunction: ' and ',
            serialComma: false,
            units: ['d', 'h', 'm'],
          });
      }
    }
    return value;
  }

  function updateUpNextTimer() {
    if (upNext) {
      upNextTimer = 'Next run' + timeToRun(upNext);
    }
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

  function cycleOnDeck() {
    onDeck = onDeckArr[onDeckIndex];
    onDeckTimer = 'Coming up' + timeToRun(onDeck);
    onDeckIndex += 1;
    if (onDeckIndex >= onDeckArr.length) {
      onDeckIndex = 0;
    }
  }

  watch(onDeckArr, () => {
    window.clearInterval(onDeckInterval);
    onDeckIndex = 0;
    if (onDeckArr.length) {
      cycleOnDeck();
      onDeckInterval = window.setInterval(cycleOnDeck, 10000);
    } else {
      onDeck = null;
    }
  });

  watch(
    () => upNext,
    () => {
      window.clearInterval(upNextCountDownCycle);
      if (
        type == 'START OF MARATHON' ||
        type == 'END OF DAY' ||
        type == 'START OF DAY'
      ) {
        updateUpNextTimer();
        upNextCountDownCycle = window.setInterval(updateUpNextTimer, 10000);
      }
    }
  );

  watch(
    () => runDataActiveRunSurrounding?.data,
    () => {
      update();
    }
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
