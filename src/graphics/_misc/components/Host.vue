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
          :style="{ 'margin-right': '10px' }"
        >
        <div>{{ host }}</div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Host as HostType } from '../../../types/schemas';

@Component
export default class Host extends Vue {
  @State host!: HostType;
}
</script>

<style scoped>
  .Flex {
    flex-direction: row;
  }
</style>
