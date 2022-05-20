<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="../_misc/layoutbackground.png" />
      <img class="bg" src="./background.png" />
    </div>
    <timer
      :style="{
        left: '140px',
        top: '977px',
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
        left: '15px',
        top: '650px',
        width: '440px',
        height: '100px',
        fontWeight: 'bold'
      }"
      :size="55"
    ></game>
    <category
      :style="{
        left: '15px',
        top: '815px',
        width: '440px',
        height: '100px',
        fontWeight: 'bold'
      }"
      :size="55"
    ></category>
    <player
      :style="{
        left: '20px',
        top: '490px',
        width: '320px',
        height: '80px',
        fontWeight: 'bold'
      }"
      :size="50"
    ></player>
    <player
      :style="{
        left: '655px',
        top: '490px',
        width: '320px',
        height: '80px',
        fontWeight: 'bold'
      }"
      :size="50"
      :team="2"
    ></player>
    <player
      :style="{
        left: '1290px',
        top: '490px',
        width: '320px',
        height: '80px',
        fontWeight: 'bold'
      }"
      :size="50"
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
    Player
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
