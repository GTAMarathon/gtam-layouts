<template>
  <div :style="{ position: 'fixed' }">
    <transition name="fade">
      <div
        v-if="host"
        :key="host"
        class="Flex"
        :style="{ position: 'absolute', 'font-size': '1.3em' }"
      >
        <img
          src="../mic.png"
          :style="{ 'margin-right': '10px', height: '33px' }"
        >
        <div>{{ host }}</div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Host as HostType } from '@gtam-layouts/types/schemas';
import { replicantNS } from '@gtam-layouts/browser_shared/replicant_store';

@Component
export default class Host extends Vue {
  @replicantNS.State((s) => s.reps.host) readonly host!: HostType;
}
</script>

<style scoped>
  .Flex {
    flex-direction: row;
  }
</style>
