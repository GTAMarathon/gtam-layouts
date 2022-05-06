<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./img/annual_hundo.png" />
      <img class="bg" src="./img/annual_hundo_back.png" />
      <img class="bg" src="./img/annual_hundo_plates.png" />
    </div>
    <timer
      :style="{
        left: '145px',
        top: '750px',
        width: '450px',
        height: '112px',
        'font-size': '32px',
      }"
    ></timer>
    <player
      :style="{
        left: '221px',
        top: '494px',
        width: '300px',
        height: '62px',
      }"
      :size="45"
    ></player>
    <player
      :style="{
        left: '1030px',
        top: '381px',
        width: '300px',
        height: '62px',
      }"
      :size="45"
      :team="2"
    ></player>
    <player
      :style="{
        left: '1620px',
        top: '381px',
        width: '300px',
        height: '62px',
      }"
      :size="45"
      :team="3"
    ></player>
    <player
      :style="{
        left: '1030px',
        top: '824px',
        width: '300px',
        height: '62px',
      }"
      :size="45"
      :team="4"
    ></player>
    <player
      :style="{
        left: '1620px',
        top: '824px',
        width: '300px',
        height: '62px',
      }"
      :size="45"
      :team="5"
    ></player>
    <completion-table
      :style="{
        width: '1921px',
        height: '193px',
        bottom: '0px',
      }"
    ></completion-table>
  </div>
</template>

<script src="./css/bootstrap.min.js" />

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { State } from "vuex-class";
import Timer from "./components/Timer.vue";
import Player from "../_misc/components/Player.vue";
import CompletionTable from "./components/CompletionTable.vue";
import { RunDataActiveRun } from "nodecg/bundles/nodecg-speedcontrol/src/types";
import { HundoTrackerData } from "@gtam-layouts/types/schemas";

@Component({
  components: {
    Timer,
    Player,
    CompletionTable,
  },
})
export default class App extends Vue {
  @State runDataActiveRun!: RunDataActiveRun;
  @State hundoTrackerData!: HundoTrackerData;
}
</script>

<style>
@import url("../_misc/Fade.css");
@import url("../_misc/Flex.css");
@import url("./css/bootstrap.min.css");
@import url("./css/style.css");
</style>
