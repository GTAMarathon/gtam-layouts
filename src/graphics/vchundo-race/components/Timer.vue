<template>
  <div
    class="Flex"
    :style="{ position: 'fixed' }"
  >
    <div
      id="Time"
      :style="{
        'font-size': '2.3em',
        transition: '1s',
        'margin-bottom': '-0.2em',
      }"
    >
      <span
      >
        {{ timer.time }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch } from 'vue-property-decorator'; // eslint-disable-line object-curly-newline, max-len
import { State } from 'vuex-class';
import { Timer as TimerType, RunDataActiveRun } from 'nodecg/bundles/nodecg-speedcontrol/src/types';

@Component
export default class Timer extends Vue {
  @State timer!: TimerType;
  @State runDataActiveRun!: RunDataActiveRun;
  @Ref('Estimate') readonly estimate!: HTMLElement;
  isMounted = false;
}
</script>

<style scoped>
  .Flex {
    flex-direction: column;
  }

  /* Each character in the timer is in a span; setting width so the numbers appear monospaced. */
  #Time > span {
    display: inline-block;
    text-align: center;
    color: #a1ebff;
  }

</style>
