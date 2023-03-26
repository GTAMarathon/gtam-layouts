<template>
  <v-app>
    <div v-if="fourPlayers" :key="fourPlayers.toString()">
      <v-btn @click="focusOnRunner(1)">{{ runner(0) }} </v-btn>
      <v-btn @click="focusOnRunner(2)">{{ runner(1) }} </v-btn>
      <v-btn @click="focusOnRunner(3)">{{ runner(2) }} </v-btn>
      <v-btn @click="focusOnRunner(4)">{{ runner(3) }} </v-btn>
    </div>
    <v-alert v-else dense type="info">
      Come back when it's a 4 players run.
    </v-alert>
  </v-app>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useReplicant } from 'nodecg-vue-composable';
  import { RunDataActiveRun } from 'nodecg/bundles/nodecg-speedcontrol/src/types';
  import { useHead } from '@vueuse/head';

  useHead({ title: 'Focus on specific runner' });

  export default defineComponent({
    setup() {
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
