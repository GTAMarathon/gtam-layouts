<template>
  <div :style="{ position: 'fixed' }">
    <transition name="fade">
      <div
        v-if="runDataActiveRun"
        :key="`${runDataActiveRun.customData.gameShort}`"
        class="Flex"
        :style="{
          position: 'absolute',
          'flex-direction': 'column',
          'font-size': '1em'
        }"
      >
        <div
          v-if="runDataActiveRun"
          :style="{ 'font-size': `${1.3 * scale}em` }"
          ref="game"
        >
          {{ runDataActiveRun.customData.gameShort }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref, Watch } from "vue-property-decorator";
import { State } from "vuex-class";
import { RunDataActiveRun } from "nodecg/bundles/nodecg-speedcontrol/src/types";
import fitty, { FittyInstance } from "fitty";

@Component
export default class Game extends Vue {
  @State runDataActiveRun!: RunDataActiveRun;
  @Prop({ default: 64 }) readonly size!: number;
  @Ref("game") game!: HTMLDivElement;
  gameFitty: FittyInstance | undefined;

  fit(): void {
    this.gameFitty = fitty(this.game, {
      maxSize: this.size,
      minSize: 16,
      multiLine: true
    });
  }

  mounted(): void {
    setTimeout(() => {
      this.fit();
    }, 100);
  }

  @Watch("runDataActiveRun")
  onRunChange() {
    setTimeout(() => {
      this.fit();
    }, 100);
  }
}
</script>
