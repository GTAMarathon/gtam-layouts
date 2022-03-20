<template>
  <div :style="{ position: 'fixed' }">
    <transition name="fade">
      <div
        v-if="!runData"
        :key="'over'"
        class="Flex"
        :style="{ 'font-size': '3em' }"
      >
        It's Over 😔
      </div>
      <div
        v-else
        :key="runData.id"
        class="Flex"
      >
        <div :style="{ 'font-size': '2.5em' }">
          {{ runData.game }}
        </div>
        <div :style="{ 'font-size': '2em' }">
          {{ runData.category }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { RunData } from '../../../../../nodecg-speedcontrol/src/types';

@Component
export default class UpcomingRun extends Vue {
  @Prop(Object) readonly runData!: RunData | null;
}
</script>

<style scoped>
  .Flex {
    flex-direction: column;
  }
</style>
