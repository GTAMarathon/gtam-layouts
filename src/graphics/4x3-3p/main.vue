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
        fontWeight: 'regular',
        'font-size': '24px'
      }"
    ></estimate>
    <game
      :style="{
        left: '740px',
        top: '210px',
        width: '440px',
        height: '100px',
        fontWeight: 'bold',
        
      }"
      :size="56"
    ></game>
    <category
      :style="{
        left: '740px',
        top: '380px',
        width: '440px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="56"
    ></category>
    <player
      :style="{
        left: '717px',
        top: '40px',
        width: '330px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="50"
    ></player>
    <player
      :style="{
        left: '717px',
        top: '560px',
        width: '330px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="50"
      :team="2"
    ></player>
    <player
      :style="{
        left: '870px',
        top: '940px',
        width: '330px',
        height: '100px',
        fontWeight: 'bold',
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
