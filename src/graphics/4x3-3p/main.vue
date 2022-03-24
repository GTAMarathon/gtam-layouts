<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="../_misc/layoutbackground.png" />
      <img class="bg" src="./background.png" />
    </div>
    <timer
      :style="{
        left: '1422px',
        top: '270px',
        width: '259px',
        height: '75px',
        'font-size': '28px'
      }"
    ></timer>
    <estimate
      :style="{
        left: '1160px',
        top: '325px',
        width: '259px',
        height: '75px',
        'font-weight': regular,
        'font-size': '24px'
      }"
    ></estimate>
    <game
      :style="{
        left: '760px',
        top: '210px',
        width: '400px',
        height: '100px',
        'font-weight': bold,
        'font-size': '30px',
        'background-color': 'transparent'
      }"
    ></game>
    <category
      :style="{
        left: '760px',
        top: '380px',
        width: '400px',
        height: '100px',
        'font-weight': bold,
        'font-size': '30px'
      }"
    ></category>
    <player
      :style="{
        left: '725px',
        top: '40px',
        width: '300px',
        height: '100px',
        'font-weight': bold,
        'font-size': '24px'
      }"
    ></player>
    <player2
      :style="{
        left: '725px',
        top: '560px',
        width: '300px',
        height: '100px',
        'font-weight': bold,
        'font-size': '24px'
      }"
    ></player2>
    <player3
      :style="{
        left: '880px',
        top: '940px',
        width: '300px',
        height: '100px',
        'font-weight': bold,
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
