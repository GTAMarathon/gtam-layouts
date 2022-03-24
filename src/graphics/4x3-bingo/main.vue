<template>
  <div>
    <img src="./background.png" />
    <timer
      :style="{
        left: '140px',
        top: '972px',
        width: '259px',
        height: '75px',
        'font-size': '22px'
      }"
    ></timer>
    <estimate
      :style="{
        left: '-55px',
        top: '965px',
        width: '259px',
        height: '75px',
        'font-weight': regular,
        'font-size': '20px'
      }"
    ></estimate>
    <game
      :style="{
        left: '30px',
        top: '650px',
        width: '400px',
        height: '100px',
        'font-weight': bold,
        'font-size': '30px',
        'background-color': 'transparent'
      }"
    ></game>
    <category
      :style="{
        left: '30px',
        top: '815px',
        width: '400px',
        height: '100px',
        'font-weight': bold,
        'font-size': '40px'
      }"
    ></category>
    <player
      :style="{
        left: '20px',
        top: '480px',
        width: '300px',
        height: '100px',
        'font-weight': bold,
        'font-size': '20px'
      }"
    ></player>
    <player2
      :style="{
        left: '660px',
        top: '480px',
        width: '300px',
        height: '100px',
        'font-weight': bold,
        'font-size': '20px'
      }"
    ></player2>
    <player3
      :style="{
        left: '1300px',
        top: '480px',
        width: '300px',
        height: '100px',
        'font-weight': bold,
        'font-size': '20px'
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
