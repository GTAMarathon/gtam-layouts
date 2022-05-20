<template>
  <th class="playerCol" :class="[multiline ? 'playerColSmall' : 'playerColBig', row>1 ? 'borderTop' : '']" scope="col">
    <div class="playerInfo" :class="multiline ? 'playerInfoSmall' : 'playerInfoBig'">
      <div class="table_pos">
        {{ formatPosition(player.customData['rank']) }}
      </div>
    </div>
    <div class="playerInfo" :class="multiline ? 'playerInfoSmall' : 'playerInfoBig'">
      <div class="table_name" ref="name">
          {{ player.name }}
      </div>
    </div>
    <div class="playerInfo" :class="multiline ? 'playerInfoSmall' : 'playerInfoBig'">
      <div class="table_score" ref="score">
          {{ scoreOrTime }}
      </div>
    </div>
  </th>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref, Watch } from "vue-property-decorator"; // eslint-disable-line object-curly-newline, max-len
import { State } from "vuex-class";
import { RunDataPlayer,Timer } from "nodecg/bundles/nodecg-speedcontrol/src/types";
import ordinal from 'ordinal';
import fitty, { FittyInstance } from "fitty";

@Component
export default class PlayerCompletion extends Vue {
  @State timer!: Timer;
  @Prop() readonly player!: RunDataPlayer;
  @Prop({ default: false }) readonly multiline!: boolean;
  @Prop({ default: 1 }) readonly row!: number;
  @Ref("name") name!: HTMLDivElement;
  @Ref("score") score!: HTMLDivElement;
  nameFitty: FittyInstance | undefined;
  scoreFitty: FittyInstance | undefined;

  formatPosition(i: string): string {
    return ordinal(parseInt(i));
  }
  get scoreOrTime(): string {
    if(this.finishTime){
      return this.finishTime;
    }
    else{
      return this.player.customData['score']+nodecg.bundleConfig.scoreTracking.suffix;
    }
  }

  get finishTime(): string | undefined {
    const teamFinishTime = this.timer.teamFinishTimes[this.player.teamID];
    if (teamFinishTime) {
      if (teamFinishTime.state === "completed") {
        return teamFinishTime.time;
      }
      if (teamFinishTime.state === "forfeit") {
        return "Forfeit";
      }
    }
    return undefined;
  }

  fit(): void {
    this.nameFitty = fitty(this.name, {minSize: 1, maxSize: 30, multiLine: true });
    this.scoreFitty = fitty(this.score, {minSize: 1, maxSize: 36, multiLine: true });
  }

@Watch("player", { immediate: true })
  onPlayerChange(player: RunDataPlayer): void {
    player.teamID
    setTimeout(() => {
      this.fit();
    }, 30);
  }
  mounted(): void {
    setTimeout(() => {
      this.fit();
    }, 500);
  }

}
</script>