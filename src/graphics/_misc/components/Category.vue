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
		            :style="{ 'font-size': `${1.3 * scale}em` }"
        >
          {{ runDataActiveRun.category }}
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
export default class Category extends Vue {
  @State runDataActiveRun!: RunDataActiveRun;
  @Prop({ default: 1 }) readonly scale!: number;
}
</script>
