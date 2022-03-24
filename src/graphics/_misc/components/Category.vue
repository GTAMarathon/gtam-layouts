<template>
  <div :style="{ position: 'fixed' }">
    <transition name="fade">
      <div
        v-if="runDataActiveRun"
        :key="`${runDataActiveRun.category}`"
        class="Flex"
      >
        <div
          v-if="runDataActiveRun"
          :style="{ 'font-size': '1.3em' }"
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
  @Ref("category") category!: HTMLDivElement;

  categoryFitty: FittyInstance | undefined;

  fit(): void {
    this.categoryFitty = fitty(this.category, {
      maxSize: this.size,
      minSize: 16,
      multiLine: true
    });
  }

  mounted() {
    setTimeout(() => {
      this.fit();
    }, 100);
  }

  @Watch("runDataActiveRun", { immediate: true })
  onRunChange() {
    setTimeout(() => {
      this.fit();
    }, 100);
  }
}
</script>
