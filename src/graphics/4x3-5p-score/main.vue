<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./background.png" />
    </div>
    <game
      :style="{
        left: '0px',
        top: '560px',
        width: '720px',
        height: '90px',
        fontWeight: 'bold'
      }"
      :size="80"
    ></game>
    <category
      :style="{
        left: '0px',
        top: '670px',
        width: '720px',
        height: '60px',
        fontWeight: 'bold'
      }"
      :size="50"
    ></category>
    <timer
      :style="{
        left: '0px',
        top: '750px',
        width: '720px',
        height: '124px',
        'font-size': '60px',
      }"
    ></timer>
    <player
      :style="{
        left: '180px',
        top: '486px',
        width: '360px',
        height: '54px',
      }"
      :size="44"
      :finishTimes="false"
      :background="true"
    ></player>
    <player
      :style="{
        left: '870px',
        top: '405px',
        width: '300px',
        height: '45px',
      }"
      :size="35"
      :team="2"
      :finishTimes="false"
      :background="true"
    ></player>
    <player
      :style="{
        left: '1470px',
        top: '405px',
        width: '300px',
        height: '45px',
      }"
     :size="35"
     :team="3"
      :finishTimes="false"
      :background="true"
    ></player>
    <player
      :style="{
        left: '870px',
        top: '855px',
        width: '300px',
        height: '45px',
      }"
     :size="35"
     :team="4"
      :finishTimes="false"
      :background="true"
    ></player>
    <player
      :style="{
        left: '1470px',
        top: '855px',
        width: '300px',
        height: '45px',
      }"
     :size="35"
     :team="5"
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
