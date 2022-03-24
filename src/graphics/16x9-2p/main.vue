<template>
  <div>
    <img src="./background.png" />
    <timer
      :style="{
        left: '955px',
        top: '900px',
        width: '259px',
        height: '77px',
        'font-size': '26px'
      }"
    ></timer>
    <estimate
      :style="{
        left: '697px',
        top: '950px',
        width: '208px',
        height: '74px',
        'font-size': '24px'
      }"
    ></estimate>
    <game
      :style="{
        left: '770px',
        top: '595px',
        width: '400px',
        height: '100px',
        'font-size': '30px'
      }"
    ></game>
    <category
      :style="{
        left: '870px',
        top: '785px',
        width: '208px',
        height: '100px',
        'font-size': '32px'
      }"
    ></category>
    <player
      :style="{
        left: '90px',
        top: '595px',
        width: '300px',
        height: '100px',
        'font-size': '24px'
      }"
    ></player>
    <player2
      :style="{
        left: '1520px',
        top: '595px',
        width: '300px',
        height: '100px',
        'font-size': '24px'
      }"
    ></player2>
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
import { RunDataActiveRun } from "nodecg/bundles/nodecg-speedcontrol/src/types";

@Component({
  components: {
    Timer,
    Estimate,
    Game,
    Category,
    Player,
    Player2
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
