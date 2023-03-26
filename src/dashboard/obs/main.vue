<template>
  <v-app>
    <v-btn block :disabled="disableChange" @click="playNextRun">
      <span v-if="nextRun">
        <v-icon left>mdi-play</v-icon>{{ nextRunGameName }}
      </span>
      <span v-else-if="runDataArray!.data!.length">End of marathon</span>
      <span v-else>No Runs Added</span>
    </v-btn>
    <v-alert
      v-if="disableChange && timer && timer.data"
      dense
      type="info"
      :style="{ 'margin-top': '5px' }"
    >
      Cannot change run while timer is {{ timer.data.state }}.
    </v-alert>
  </v-app>
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

      const nextRun = computed<RunData>((): RunData => {
        const runToReturn: RunData | undefined = runDataArray!.data!.find(
          (run: RunData) => run.id === runDataActiveRunSurrounding!.data!.next
        );
        return runToReturn!;
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
        return ['running', 'paused'].includes(timer!.data!.state);
      });

      function playNextRun(): void {
        if (nextRun) {
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
