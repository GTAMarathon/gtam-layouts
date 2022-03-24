<template>
  <div>
    <img src="./background.png" />
    <upcoming-run
      :run-data="nextRun"
      :style="{
        left: '940px',
        top: '410px',
        width: '1000px',
        height: '145px',
        'font-size': '19px'
      }"
    ></upcoming-run>
    <upcoming-run
      :run-data="onDeck"
      :style="{
        left: '940px',
        top: '710px',
        width: '1000px',
        height: '145px',
        'font-size': '19px'
      }"
    ></upcoming-run>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { State } from "vuex-class";
import UpcomingRun from "./components/UpcomingRun.vue";
import { RunData } from "nodecg/bundles/nodecg-speedcontrol/src/types";
import {
  RunDataActiveRunSurrounding,
  RunDataArray
} from "nodecg/bundles/nodecg-speedcontrol/src/types/schemas";

@Component({
  components: {
    UpcomingRun,
  }
})
export default class App extends Vue {
  @State runDataArray!: RunDataArray;
  @State runDataActiveRunSurrounding!: RunDataActiveRunSurrounding;
  nextRun: RunData | null = null;
  onDeckArr: RunData[] = [];

  mounted(): void {
    this.updateNextRuns();
    nodecg.listenFor("refreshIntermission", () => this.updateNextRuns());
    nodecg.listenFor("nextRun", () => this.updateNextRuns());
  }

  updateNextRuns(): void {
    let runIndex = this.runDataArray.findIndex(
      run => run.id === this.runDataActiveRunSurrounding.next
    );
    this.nextRun = this.runDataArray[runIndex] || null;
    if (this.runDataActiveRunSurrounding.next) {
      runIndex = runIndex < 0 ? 1 : runIndex + 1;
      this.onDeckArr = this.runDataArray.slice(runIndex, runIndex + 3);
    } else {
      this.onDeckArr = [];
    }
  }

  // Update/cycle the "on deck" run when needed.
  onDeck: RunData | null = null;
  onDeckIndex = 0;
  onDeckInterval?: number;
  @Watch("onDeckArr", { immediate: true })
  onDeckChange(): void {
    window.clearInterval(this.onDeckInterval);
    this.onDeckIndex = 0;
    if (this.onDeckArr.length) {
      this.cycleOnDeck();
      this.onDeckInterval = window.setInterval(this.cycleOnDeck, 10000);
    } else {
      this.onDeck = null;
    }
  }
  cycleOnDeck(): void {
    this.onDeck = this.onDeckArr[this.onDeckIndex];
    this.onDeckIndex += 1;
    if (this.onDeckIndex >= this.onDeckArr.length) {
      this.onDeckIndex = 0;
    }
  }
}
</script>

<style>
@import url("../_misc/common.css");
@import url("../_misc/Fade.css");
@import url("../_misc/Flex.css");
</style>
