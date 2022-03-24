<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="../_misc/layoutbackground.png" />
      <img class="bg" src="./background.png" />
    </div>
    <timer
      :style="{
        left: '1656px',
        top: '913px',
        width: '259px',
        height: '77px',
        'font-size': '26px'
      }"
    ></timer>
    <estimate
      :style="{
        left: '1385px',
        top: '952px',
        width: '259px',
        height: '100px',
        'font-weight': regular,
        'font-size': '24px'
      }"
    ></estimate>
    <game
      :style="{
        left: '980px',
        top: '806px',
        width: '500px',
        height: '100px',
        'font-weight': bold,
        'font-size': '22px',
        'background-color': 'transparent'
      }"
    ></game>
    <category
      :style="{
        left: '1555px',
        top: '817px',
        width: '400px',
        height: '75px',
        'font-weight': bold,
        'font-size': '26px'
      }"
    ></category>
    <player
      :style="{
        left: '1000px',
        top: '40px',
        width: '300px',
        height: '100px',
        'font-size': '24px'
      }"
    ></player>
    <player2
      :style="{
        left: '1000px',
        top: '950px',
        width: '300px',
        height: '100px',
        'font-size': '24px'
      }"
    ></player2>
    <player3
      :style="{
        left: '1540px',
        top: '160px',
        width: '300px',
        height: '100px',
        'font-size': '24px'
      }"
    ></player3>
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
import Player2 from "../_misc/components/Player2.vue";
import Player3 from "../_misc/components/Player3.vue";
import { RunDataActiveRun } from "nodecg/bundles/nodecg-speedcontrol/src/types";

@Component({
  components: {
    Timer,
    Estimate,
    Game,
    Category,
    Player,
    Player2,
    Player3
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
