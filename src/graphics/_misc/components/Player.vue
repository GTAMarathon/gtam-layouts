<template>
  <div :style="{ position: 'fixed' }">
    <transition name="fade">
      <div
        v-if="name"
        :key="name"
        class="Flex"
        :style="{ position: 'absolute', 'font-size': '1.5em' }"
      >
        <div
          :style="{
            'margin-left': '5px',
            'font-size': small ? '1.1em' : '1.3em'
          }"
          ref="player"
        >
          {{ name }}
          <span v-if="finishTime" :style="{ 'font-size': '0.75em' }">
            [{{ finishTime }}]
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator"; // eslint-disable-line object-curly-newline, max-len
import { State } from "vuex-class";
import {
  RunDataActiveRun,
  Timer
} from "nodecg/bundles/nodecg-speedcontrol/src/types";
import fitty, { FittyInstance } from "fitty";

@Component
export default class Player extends Vue {
  @State("runDataActiveRun") run!: RunDataActiveRun;
  @State timer!: Timer;
  @Prop({ default: 64 }) readonly size!: number;
  @Prop({ default: 1 }) readonly team!: number;
  @Ref("player") player!: HTMLDivElement;
  timeout?: number;
  teamI = 0;
  index = 0;
  name: string | null = null;
  playerFitty: FittyInstance | undefined;

  fit(): void {
    this.playerFitty = fitty(this.player, {
      maxSize: this.size,
      minSize: 16,
      multiLine: true
    });
  }

  get finishTime(): string | undefined {
    if (!this.run || this.run.teams.length <= 1) {
      return undefined;
    }
    const teamFinishTime = this.timer.teamFinishTimes[
      this.run.teams[this.teamI].id
    ];
    if (teamFinishTime) {
      if (teamFinishTime.state === "completed") {
        return this.timer.teamFinishTimes[this.run.teams[this.teamI].id].time;
      }
      if (teamFinishTime.state === "forfeit") {
        return "Forfeit";
      }
    }
    return undefined;
  }

  @Watch("run", { immediate: true })
  onRunChange(val: RunDataActiveRun): void {
    window.clearTimeout(this.timeout);
    this.teamI = this.team - 1;
    this.index = 0;
    this.name = null;
    const coop = !!(
      val &&
      val.teams.length === 1 &&
      val.teams[0].players.length >= 2
    );

    if (val) {
      if (coop && val.teams[0].players[this.teamI]) {
        this.name = val.teams[0].players[this.teamI].name;
      } else if (
        !coop &&
        val.teams[this.teamI] &&
        val.teams[this.teamI].players.length
      ) {
        this.showNextName();
      }
    }

    setTimeout(() => {
      this.fit();
    }, 100);
  }

  showNextName(): void {
    if (!this.run) {
      return;
    }
    const { players } = this.run.teams[this.teamI];
    this.name = players[this.index].name;
    this.timeout = window.setTimeout(() => this.showNextName(), 30 * 1000);
    this.index = players.length <= this.index + 1 ? 0 : this.index + 1;
  }

  mounted(): void {
    setTimeout(() => {
      this.fit();
    }, 100);
  }
}
</script>
