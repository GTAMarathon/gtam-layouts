<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="../_misc/layoutbackground.png" />
      <img class="bg" src="./background.png" />
    </div>
    <timer
      :style="{
        left: '1693px',
        top: '537px',
        width: '259px',
        height: '75px',
        'font-size': '20px'
      }"
    ></timer>
    <estimate
      :style="{
        left: '1525px',
        top: '530px',
        width: '259px',
        height: '75px',
        'font-weight': regular,
        'font-size': '20px'
      }"
    ></estimate>
    <game
      :style="{
        left: '998px',
        top: '544px',
        width: '250px',
        height: '75px',
        'font-weight': bold,
        'font-size': '26px',
        'background-color': 'transparent'
      }"
    ></game>
    <category
      :style="{
        left: '1275px',
        top: '542px',
        width: '400px',
        height: '75px',
        'font-weight': bold,
        'font-size': '30px'
      }"
    ></category>
    <player
      :style="{
        left: '955px',
        top: '990px',
        width: '300px',
        height: '100px',
        'font-weight': bold,
        'font-size': '16px'
      }"
    ></player>
    <player
      :style="{
        left: '1290px',
        top: '990px',
        width: '300px',
        height: '100px',
        'font-weight': bold,
        'font-size': '16px'
      }"
      :team="2"
    ></player>
    <player
      :style="{
        left: '1620px',
        top: '990px',
        width: '300px',
        height: '100px',
        'font-weight': bold,
        'font-size': '16px'
      }"
      :team="3"
    ></player>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { State } from "vuex-class";
import Timer from "../_misc/components/Timer.vue";
import Estimate from "../_misc/components/Estimate.vue";
import Game from "../_misc/components/Game.vue";
import Category from "../_misc/components/Category.vue";
import Player from "../_misc/components/Player.vue";
import { RunDataActiveRun } from "nodecg/bundles/nodecg-speedcontrol/src/types";

@Component({
  components: {
    Timer,
    Estimate,
    Game,
    Category,
    Player,
  }
})
export default class App extends Vue {
  @State runDataActiveRun!: RunDataActiveRun;
}
</script>

<style>
@import url("../_misc/common.css");
@import url("../_misc/Fade.css");
@import url("../_misc/Flex.css");
</style>
