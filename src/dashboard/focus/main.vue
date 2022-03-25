<template>
  <v-app>
    <div v-if="fourPlayersCoop" :key="fourPlayersCoop">
      <v-btn @click="focusOnRunner(1)">{{ runner(0) }} </v-btn>
      <v-btn @click="focusOnRunner(2)">{{ runner(1) }} </v-btn>
      <v-btn @click="focusOnRunner(3)">{{ runner(2) }} </v-btn>
      <v-btn @click="focusOnRunner(4)">{{ runner(3) }} </v-btn>
    </div>
    <v-alert v-else dense type="info">
      Come back when it's a 4 players coop run.
    </v-alert>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { State } from "vuex-class";
import { RunDataActiveRun } from "nodecg/bundles/nodecg-speedcontrol/src/types/schemas";

@Component
export default class App extends Vue {
  @State runDataActiveRun!: RunDataActiveRun;

  runner(runnerNumber: number): string {
    return this.fourPlayersCoop
      ? this.runDataActiveRun.teams[0].players[runnerNumber]?.name
      : "";
  }

  get fourPlayersCoop(): boolean {
    return (
      this.runDataActiveRun &&
      this.runDataActiveRun.teams &&
      this.runDataActiveRun.teams.length == 1 &&
      this.runDataActiveRun.teams[0].players.length == 4
    );
  }

  focusOnRunner(num: number): void {
    nodecg
      .sendMessage("focusOnRunner", num)
      .then(() => {
        // run change successful
      })
      .catch(() => {
        // run change unsuccessful
      });
  }
}
</script>