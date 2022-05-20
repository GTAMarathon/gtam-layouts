<template>
  <div :style="{ position: 'fixed', 'background-color':'rgba(43, 120, 228, 0.5)',}">
    <table v-for="i in rows" class="table table-bordered">
      <player-completion
        v-for="(player) in playersRankedChunked(i-1)"
        :player="player"
        :row="i"
        :multiline="rows>1"
        :key="player.name"
      />
    </table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator"; // eslint-disable-line object-curly-newline, max-len
import { State } from "vuex-class";
import { RunDataActiveRun, RunDataPlayer } from "nodecg/bundles/nodecg-speedcontrol/src/types";
import PlayerCompletion from "./PlayerCompletion.vue";

@Component({
  components: {
    PlayerCompletion,
  },
})
export default class CompletionTable extends Vue {
  @State runDataActiveRun!: RunDataActiveRun;
  @Prop({ default: 1 }) readonly rows!: number;
  get playersRanked(): RunDataPlayer[][] {
    var ret: RunDataPlayer[][] = [];
    if(this.runDataActiveRun){
      var players = this.runDataActiveRun.teams.flatMap(team => team.players);
      players?.sort((a,b) => +a.customData['rank'] - +b.customData['rank']);
      const severalPartIndex = Math.ceil(players.length / this.rows);
      for(var i = 0; i<this.rows; i++){
        ret.unshift(players.splice(-severalPartIndex))
      }
    }
    return ret;
  }
  playersRankedChunked(index: number): RunDataPlayer[] {
    return this.playersRanked[index];
}

}
</script>