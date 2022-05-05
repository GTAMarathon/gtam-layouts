<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="../_misc/layoutbackground.png" />
      <img class="bg" src="./background.png" />
    </div>
    <timer
      :style="{
        left: '222px',
        top: '653px',
        width: '259px',
        height: '75px',
        'font-size': '26px'
      }"
    ></timer>
    <estimate
      :style="{
        left: '-50px',
        top: '705px',
        width: '259px',
        height: '75px',
        'font-weight': regular,
        'font-size': '24px'
      }"
    ></estimate>
    <game
      :style="{
        left: '15px',
        top: '335px',
        width: '450px',
        height: '100px',
        fontWeight: 'bold'
      }"
      :size="46"
    ></game>
    <category
      :style="{
        left: '15px',
        top: '535px',
        width: '450px',
        height: '75px',
        fontWeight: 'bold'
      }"
      :size="50"
    ></category>
    <player
      :style="{
        left: '15px',
        top: '905px',
        width: '450px',
        height: '75px',
        fontWeight: 'bold'
      }"
      :size="56"
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
