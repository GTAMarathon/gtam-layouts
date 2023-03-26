<template>
  <div>
    <QBtn
      color="black"
      block
      :disabled="disableChange"
      @click.native="playNextRun"
    >
      <span v-if="nextRun">
        <QIcon name="mdi-play" left />{{ nextRunGameName }}
      </span>
      <span
        v-else-if="runDataArray && runDataArray.data && runDataArray!.data!.length"
        >End of marathon</span
      >
      <span v-else>No Runs Added</span>
    </QBtn>
    <QBanner
      v-if="disableChange && timer && timer.data"
      class="bg-primary text-white"
      :style="{ 'margin-top': '5px' }"
    >
      Cannot change run while timer is {{ timer.data.state }}.
    </QBanner>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useReplicant } from 'nodecg-vue-composable';
  import { RunDataActiveRunSurrounding } from 'nodecg/bundles/nodecg-speedcontrol/src/types/schemas';
  import {
    RunDataArray,
    RunData,
    Timer,
  } from 'nodecg/bundles/nodecg-speedcontrol/src/types';
  import { useHead } from '@vueuse/head';

  useHead({ title: 'Switch to next game' });

  export default defineComponent({
    setup() {
      const runDataArray = useReplicant<RunDataArray>(
        'runDataArray',
        'nodecg-speedcontrol'
      );

      const runDataActiveRunSurrounding =
        useReplicant<RunDataActiveRunSurrounding>(
          'runDataActiveRunSurrounding',
          'nodecg-speedcontrol'
        );

      const timer = useReplicant<Timer>('timer', 'nodecg-speedcontrol');

      const nextRun = computed<RunData | null>((): RunData | null => {
        if (
          runDataArray &&
          runDataArray.data &&
          runDataActiveRunSurrounding &&
          runDataActiveRunSurrounding.data
        ) {
          const runToReturn: RunData | undefined = runDataArray!.data!.find(
            (run: RunData) => run.id === runDataActiveRunSurrounding!.data!.next
          );
          return runToReturn!;
        } else {
          return null;
        }
      });

      const nextRunGameName = computed<string>((): string => {
        if (nextRun.value && nextRun.value.game) {
          return `${nextRun.value.game.slice(0, 35)}${
            nextRun.value.game.length > 35 ? '...' : ''
          }`;
        }
        return '(The Run With No Name)';
      });

      const disableChange = computed<boolean>((): boolean => {
        if (timer && timer.data) {
          return ['running', 'paused'].includes(timer!.data!.state);
        } else {
          return true;
        }
      });

      function playNextRun(): void {
        if (nextRun && nextRun.value) {
          console.log('Setting next run');
          nodecg
            .sendMessage('nextRun')
            .then(() => {
              // run change successful
            })
            .catch(() => {
              // run change unsuccessful
            });
        } else {
          nodecg
            .sendMessage('endOfMarathon')
            .then(() => {})
            .catch(() => {});
        }
      }

      return {
        runDataArray,
        runDataActiveRunSurrounding,
        timer,
        nextRun,
        nextRunGameName,
        disableChange,
        playNextRun,
      };
    },
  });
</script>
