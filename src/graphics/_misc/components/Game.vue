<template>
  <div :style="{ position: 'fixed' }">
    <transition name="fade">
      <div
        v-if="runDataActiveRun"
        :key="`${gameName}`"
        class="Flex"
        :style="{
          position: 'absolute',
          'flex-direction': 'column',
        }"
      >
        <div
          v-if="runDataActiveRun"
          :style="{ 'padding-left': '0.1em', 'padding-right': '0.1em'}"
          ref="game"
        >
          {{ gameName }}
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

  get gameName(): string | undefined {
    return this.runDataActiveRun?.customData['gameShort'] ? this.runDataActiveRun?.customData['gameShort'] : this.runDataActiveRun?.game;
  }
  fit(): void {
    this.gameFitty = fitty(this.game, {
      maxSize: this.size,
      minSize: 1,
      multiLine: true
    });
  }

  mounted(): void {
    setTimeout(() => {
      this.fit();
    }, 500);
  }

  @Watch("runDataActiveRun")
  onRunChange() {
    setTimeout(() => {
      this.fit();
    }, 30);
  }
}
</script>
