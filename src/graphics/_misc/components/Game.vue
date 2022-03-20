<template>
  <div :style="{ position: 'fixed' }">
    <transition name="fade">
      <div
        v-if="runDataActiveRun"
        :key="`${runDataActiveRun.customData.gameShort}`"
        class="Flex"
        :style="{ position: 'absolute', 'flex-direction': 'column', 'font-size': '1em' }"
      >
        <div
          v-if="runDataActiveRun"
          :style="{ 'font-size': `${1.3 * scale}em` }"
        >
          {{ runDataActiveRun.customData.gameShort }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { RunDataActiveRun } from '../../../../../nodecg-speedcontrol/src/types';

@Component
export default class Game extends Vue {
  @State runDataActiveRun!: RunDataActiveRun;
  @Prop({ default: 1 }) readonly scale!: number;

    mounted(): void {
    // nodecg.log.info(this.runDataActiveRun.customData);
  }

}
</script>
