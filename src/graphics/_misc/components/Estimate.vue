<template>
  <div
    class="Flex"
    :style="{ position: 'fixed' }"
  >
   <div
      v-if="runDataActiveRun"
      :style="{
        'font-size': '1.6em',
        display: 'flex',
        'flex-direction': 'row',
        'justify-content': 'center',
        width: '100%',
      }"
    >
       <div :style="{ 'margin-left': '5px', width: estimateWidth }">
        <transition name="fade">
          <div
            id="Estimate"
            ref="Estimate"
            :key="`${runDataActiveRun.id}${runDataActiveRun.estimate}`"
            :style="{ position: 'absolute' }"
          >
            <span
              v-for="char in runDataActiveRun.estimate.split('')"
              :key="`${Math.random()}${char}`"
              :class="(char === ':' ? 'Colon' : undefined)"
            >
              {{ char }}
            </span>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch } from 'vue-property-decorator'; // eslint-disable-line object-curly-newline, max-len
import { State } from 'vuex-class';
import { Timer as TimerType, RunDataActiveRun } from 'nodecg/bundles/nodecg-speedcontrol/src/types';

@Component
export default class Estimate extends Vue {
  @State timer!: TimerType;
  @State runDataActiveRun!: RunDataActiveRun;
  @Ref('Estimate') readonly estimate!: HTMLElement;
  isMounted = false;
  estimateWidth = '0px';

  @Watch('runDataActiveRun', { immediate: true })
  onRunChange(newVal: TimerType, oldVal?: TimerType): void {
    if (!oldVal && newVal) {
      Vue.nextTick()
        .then(() => {
          this.estimateWidth = `${this.estimate.clientWidth}px`;
        });
    }
  }
}
</script>

<style scoped>
  .Flex {
    flex-direction: column;
  }

  /* Each character in the timer is in a span; setting width so the numbers appear monospaced. */
  #Time > span, #Estimate > span {
    display: inline-block;
    width: 0.5em;
    text-align: center;
  }
  #Time > .Colon, #Estimate > .Colon {
    width: 0.3em;
  }

  .stopped {
    color: #63d760;
  }
  .running {
    color: #63d760;
  }
  .paused {
    color: #63d760;
  }
  .finished {
    color: #caa12d;
  }
</style>
