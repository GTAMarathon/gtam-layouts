<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./background.png" />
    </div>
    <game
      :style="{
        left: '0px',
        top: '0px',
        width: '720px',
        height: '300px',
        fontWeight: 'bold'
      }"
      :size="150"
    ></game>
    <category
      :style="{
        left: '0px',
        top: '330px',
        width: '720px',
        fontWeight: 'bold'
      }"
      :size="90"
      :multiline="true"
    ></category>
    <timer
      :style="{
        left: '0px',
        top: '680px',
        width: '720px',
        height: '150px',
        'font-size': '65px',
      }"
    ></timer>
    <player
      :style="{
        left: '1020px',
        top: '810px',
        width: '600px',
        height: '90px',
      }"
      :size="80"
      :finishTimes="false"
      :background="true"
    ></player>
    <completion-table
      :style="{
        width: '1921px',
        height: '180px',
        top: '900px',
        left: '-1px',
      }"
    ></completion-table>
  </div>
</template>

<script src="@gtam-layouts/_misc/bootstrap.min.js" />

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { State } from "vuex-class";
import CompletionTable from "@gtam-layouts/_misc/components/CompletionTable.vue";
import Player from "@gtam-layouts/_misc/components/Player.vue";
import Timer from "@gtam-layouts/_misc/components/Timer.vue";
import Game from "@gtam-layouts/_misc/components/Game.vue";
import Category from "@gtam-layouts/_misc/components/Category.vue";
import { RunDataActiveRun } from "nodecg/bundles/nodecg-speedcontrol/src/types";

@Component({
  components: {
    Timer,
    Player,
    Game,
    Category,
    CompletionTable,
  },
})
export default class App extends Vue {
  @State runDataActiveRun!: RunDataActiveRun;
}
</script>

<style>
@import url("@gtam-layouts/_misc/Fade.css");
@import url("@gtam-layouts/_misc/Flex.css");
@import url("@gtam-layouts/_misc/common.css");
@import url("@gtam-layouts/_misc/bootstrap.min.css");
@import url("@gtam-layouts/_misc/scoring.css");
</style>
