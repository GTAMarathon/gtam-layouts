<template>
  <div
    class="Flex"
    :style="{ position: 'fixed' }"
  >
    <div
      id="Time"
      :class="timer.state"
      :style="{
        'font-size': '2.3em',
        transition: '1s',
        'margin-bottom': '-0.2em',
      }"
    >
      <span
        v-for="char in timer.time.split('')"
        :key="`${Math.random()}${char}`"
        :class="(char === ':' ? 'Colon' : undefined)"
      >
        {{ char }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch } from 'vue-property-decorator'; // eslint-disable-line object-curly-newline, max-len
import { State } from 'vuex-class';
import { Timer as TimerType, RunDataActiveRun } from '../../../../../nodecg-speedcontrol/src/types';

@Component
export default class Timer extends Vue {
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
    color: #a3a3a3;
  }
  .running {
    color: #03f0fc;
  }
  .paused {
    color: #00b1ba;
  }
  .finished {
    color: #63d760;
  }
</style>
