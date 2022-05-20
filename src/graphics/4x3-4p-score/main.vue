<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./background.png" />
    </div>
    <game
      v-if="runDataActiveRun.teams.length>8"
      :style="{
        left: '0px',
        top: '20px',
        width: '1120px',
        height: '90px',
        fontWeight: 'bold'
      }"
      :size="80"
    ></game>
    <game
      v-else
      :style="{
        left: '0px',
        top: '20px',
        width: '1120px',
        height: '105px',
        fontWeight: 'bold'
      }"
      :size="92"
    ></game>
    <category
      v-if="runDataActiveRun.teams.length>8"
      :style="{
        left: '0px',
        top: '130px',
        width: '1120px',
        height: '60px',
        fontWeight: 'bold'
      }"
      :size="50"
    ></category>
    <category
      v-else
      :style="{
        left: '0px',
        top: '145px',
        width: '1120px',
        height: '70px',
        fontWeight: 'bold'
      }"
      :size="60"
    ></category>
    <timer
      v-if="runDataActiveRun.teams.length>8"
      :style="{
        left: '0px',
        top: '210px',
        width: '1120px',
        height: '124px',
        'font-size': '60px',
      }"
    ></timer>
    <timer
      v-else
      :style="{
        left: '0px',
        top: '235px',
        width: '1120px',
        height: '145px',
        'font-size': '70px',
      }"
    ></timer>
    <player
      :style="{
        left: '1320px',
        top: '540px',
        width: '400px',
        height: '60px',
      }"
      :size="50"
      :finishTimes="false"
      :background="true"
    ></player>
    <player
      :style="{
        left: '160px',
        top: '1032px',
        width: '320px',
        height: '48px',
      }"
      :size="38"
      :team="2"
      :finishTimes="false"
      :background="true"
    ></player>
    <player
      :style="{
        left: '800px',
        top: '1032px',
        width: '320px',
        height: '48px',
      }"
      :size="38"
     :team="3"
      :finishTimes="false"
      :background="true"
    ></player>
    <player
      :style="{
        left: '1440px',
        top: '1032px',
        width: '320px',
        height: '48px',
      }"
      :size="38"
     :team="4"
      :finishTimes="false"
      :background="true"
    ></player>
    <completion-table
      v-if="runDataActiveRun.teams.length>8"
      :rows="2"
      :style="{
        width: '1121px',
        height: '240px',
        top: '360px',
        left: '-1px',
      }"
    ></completion-table>
    <completion-table
      v-else
      :style="{
        width: '1121px',
        height: '180px',
        top: '420px',
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
