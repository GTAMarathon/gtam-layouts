<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="../_misc/layoutbackground.png" />
      <img class="bg" src="./background.png" />
    </div>
    <timer
      :style="{
        left: '1345px',
        top: '987px',
        width: '259px',
        height: '75px',
        'font-size': '26px'
      }"
    ></timer>
    <estimate
      :style="{
        left: '1070px',
        top: '973px',
        width: '259px',
        height: '85px',
        'font-weight': regular,
        'font-size': '24px'
      }"
    ></estimate>
    <game
      :style="{
        left: '240px',
        top: '982px',
        width: '400px',
        height: '100px',
        'font-weight': bold,
        'font-size': '30px',
        'background-color': 'transparent'
      }"
    ></game>
    <category
      :style="{
        left: '764px',
        top: '982px',
        width: '400px',
        height: '100px',
        'font-weight': bold,
        'font-size': '22px'
      }"
    ></category>
    <player
      :style="{
        left: '1445px',
        top: '203px',
        width: '275px',
        height: '100px',
        'font-size': '24px'
      }"
      :team="3"
    ></player>
    <player
      :style="{
        left: '122px',
        top: '867px',
        width: '400px',
        height: '100px',
        'font-size': '24px'
      }"
      :team="2"
    ></player>
    <player
      :style="{
        left: '763px',
        top: '867px',
        width: '400px',
        height: '100px',
        'font-size': '24px'
      }"
    ></player>
    <player
      :style="{
        left: '1401px',
        top: '867px',
        width: '400px',
        height: '100px',
        'font-size': '24px'
      }"
      :team="4"
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
