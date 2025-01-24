<template>
  <div>
    <div v-if="fourPlayers" :key="fourPlayers.toString()">
      <QBtn color="black" @click="focusOnRunner(1)">{{ runner(0) }} </QBtn>
      <QBtn color="black" @click="focusOnRunner(2)">{{ runner(1) }} </QBtn>
      <QBtn color="black" @click="focusOnRunner(3)">{{ runner(2) }} </QBtn>
      <QBtn color="black" @click="focusOnRunner(4)">{{ runner(3) }} </QBtn>
    </div>
    <QBanner v-else class="bg-primary text-white">
      Come back when it's a 4 players run.
    </QBanner>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useReplicant } from 'nodecg-vue-composable';
  import { RunDataActiveRun } from 'speedcontrol/types';
  import { useHead } from '@vueuse/head';

  export default defineComponent({
    setup() {
      useHead({ title: 'Focus on specific runner' });

      const runDataActiveRun = useReplicant<RunDataActiveRun>(
        'runDataActiveRun',
        'nodecg-speedcontrol'
      );

      const fourPlayersCoop = computed<boolean>((): boolean => {
        return (
          runDataActiveRun!.data! &&
          runDataActiveRun!.data!.teams &&
          runDataActiveRun!.data!.teams.length == 1 &&
          runDataActiveRun!.data!.teams[0].players.length == 4
        );
      });

      const fourTeams = computed<boolean>((): boolean => {
        return (
          runDataActiveRun!.data! &&
          runDataActiveRun!.data!.teams &&
          runDataActiveRun!.data!.teams.length == 4
        );
      });

      const fourPlayers = computed<boolean>((): boolean => {
        return fourTeams.value || fourPlayersCoop.value;
      });

      function runner(runnerNumber: number): string {
        if (fourPlayersCoop.value) {
          return runDataActiveRun!.data!.teams[runnerNumber].players[0]?.name;
        }
        if (fourTeams.value) {
          return runDataActiveRun!.data!.teams[runnerNumber].players[0]?.name;
        }
        return '';
      }

      function focusOnRunner(num: number): void {
        nodecg
          .sendMessage('focusOnRunner', num)
          .then(() => {
            // run change successful
          })
          .catch(() => {
            // run change unsuccessful
          });
      }

      return {
        runDataActiveRun,
        fourPlayersCoop,
        fourTeams,
        fourPlayers,
        runner,
        focusOnRunner,
      };
    },
  });
</script>
