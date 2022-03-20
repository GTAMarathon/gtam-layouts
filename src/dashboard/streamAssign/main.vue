<template>
  <v-app>
    <div v-if="enableChange">
      <div>
        <div v-if="!selectedRunner">
          <v-btn
            v-for="runner in runners"
            :key="runner.id"
            :style="{ 'margin-right': '5px' }"
            v-on:click="select(runner)"
          >
            {{ runner.name }}
          </v-btn>
        </div>
        <div v-else>
          <v-btn color="accent" disabled>
            {{ selectedRunner.name }}
          </v-btn>
        </div>
      </div>
      <div v-if="selectedRunner">
        <v-btn
          v-for="stream in streams"
          :key="stream"
          @click="assign(stream)"
          color="primary"
          :style="{
            'margin-top': '5px',
            'margin-right': '5px',
          }"
        >
          {{ stream.name }}
          <br />
          ({{ stream.twitchAccount }})
        </v-btn>
        <v-btn
          v-on:click="select(undefined)"
          color="secondary"
          :style="{
            'margin-top': '5px',
            'margin-right': '5px',
          }"
        >
          CANCEL
        </v-btn>
      </div>
    </div>
    <v-alert v-else dense type="info">
      Cannot change runners' feeds while the timer is running
    </v-alert>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { State } from "vuex-class";
import {
  RunDataActiveRun,
  Timer,
} from "../../../../nodecg-speedcontrol/src/types/schemas";

interface Player {
  name: string;
  id: string;
  teamID: string;
  country?: string;
  pronouns?: string;
  social: {
    twitch?: string;
  };
}

interface Stream {
  name: string;
  twitchAccount: string;
}

@Component
export default class App extends Vue {
  @State runDataActiveRun!: RunDataActiveRun;
  @State timer!: Timer;
  streams: Stream[] = nodecg.bundleConfig.feeds.streams;
  model = {
    selectedRunner: undefined,
  };

  get enableChange(): boolean {
    return !["running", "paused"].includes(this.timer.state);
  }

  get runners(): Player[] {
    var players = [];
    if (this.runDataActiveRun && this.runDataActiveRun.teams) {
      for (var team of this.runDataActiveRun.teams) {
        for (var player of team.players) {
          players.push(player);
        }
      }
    }
    return players;
  }
  get selectedRunner(): Player | undefined {
    return this.model.selectedRunner;
  }

  select(runner: Player): void {
    this.$set(this.model, "selectedRunner", runner);
  }

  assign(stream: Stream): void {
    var data = {
      runner: this.selectedRunner,
      stream: stream,
    };
    nodecg
      .sendMessage("assignStreamToRunner", data)
      .then(() => {})
      .catch(() => {});

    this.$set(this.model, "selectedRunner", undefined);
  }
}
</script>