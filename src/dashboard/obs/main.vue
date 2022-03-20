<template>
  <v-app>
    <v-btn
      block
      :disabled="disableChange || !nextRun"
      @click="playNextRun"
    >
      <span v-if="nextRun">
        <v-icon left>mdi-play</v-icon>{{ nextRunGameName }}
      </span>
      <span v-else-if="runDataArray.length">
        No Runs Left
      </span>
      <span v-else>
        No Runs Added
      </span>
    </v-btn>
    <v-alert
      v-if="disableChange"
      dense
      type="info"
      :style="{ 'margin-top': '5px' }"
    >
      Cannot change run while timer is {{ timer.state }}.
    </v-alert>
    <v-btn
      :style="{ 'margin-top': '5px' }"
      :disabled="refreshing"
      :loading="refreshing"
      @click="forceRefreshIntermission"
    >
      Force Refresh Intermission
    </v-btn>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { RunDataActiveRunSurrounding } from '../../../../nodecg-speedcontrol/src/types/schemas';
import { RunDataArray, RunData, Timer } from '../../../../nodecg-speedcontrol/src/types';

@Component
export default class App extends Vue {
  @State runDataArray!: RunDataArray;
  @State runDataActiveRunSurrounding!: RunDataActiveRunSurrounding;
  @State timer!: Timer;

  get nextRun(): RunData | undefined {
    return this.runDataArray.find((run) => run.id === this.runDataActiveRunSurrounding.next);
  }
  get nextRunGameName(): string {
    if (this.nextRun && this.nextRun.game) {
      return `${this.nextRun.game.slice(0, 35)}${(this.nextRun.game.length > 35) ? '...' : ''}`;
    }
    return '(The Run With No Name)';
  }
  get disableChange(): boolean {
    return ['running', 'paused'].includes(this.timer.state);
  }

  playNextRun(): void {
    if (this.nextRun) {
      nodecg.sendMessage('nextRun').then(() => {
        // run change successful
      }).catch(() => {
        // run change unsuccessful
      });
    }
  }

  refreshing = false;
  forceRefreshIntermission(): void {
    this.refreshing = true;
    nodecg.sendMessage('refreshIntermission');
    setTimeout(() => { this.refreshing = false; }, 1000);
  }
}
</script>
