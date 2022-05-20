<template>
  <div :style="{ position: 'fixed' }">
    <transition name="fade">
      <div
        v-if="runDataActiveRun"
        :key="`${runDataActiveRun.category}`"
        :class="[multiline ? 'text-centered' : 'Flex']"
      >
        <div
          v-if="runDataActiveRun"
          :style="{ 'padding-left': '0.1em', 'padding-right': '0.1em', 'font-size': size+'px', }"
          ref="category"
        >
          {{ runDataActiveRun.category }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Prop, Watch } from "vue-property-decorator";
import { State } from "vuex-class";
import { RunDataActiveRun } from "nodecg/bundles/nodecg-speedcontrol/src/types";
import fitty, { FittyInstance } from "fitty";

@Component
export default class Category extends Vue {
  @State runDataActiveRun!: RunDataActiveRun;
  @Prop({ default: 64 }) readonly size!: number;
  @Prop({ default: false }) readonly multiline!: boolean;
  @Ref("category") category!: HTMLDivElement;

  categoryFitty: FittyInstance | undefined;

  fit(): void {
    this.categoryFitty = fitty(this.category, {
      maxSize: this.size,
      minSize: 1,
      multiLine: true
    });
  }

  mounted() {
    if(!this.multiline){
      setTimeout(() => {
        this.fit();
      }, 500);
    }
  }

  @Watch("runDataActiveRun", { immediate: true })
  onRunChange() {
    if(!this.multiline){
      setTimeout(() => {
        this.fit();
      }, 30);
    }
  }
}
</script>
