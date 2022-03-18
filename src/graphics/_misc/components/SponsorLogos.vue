<template>
  <div :style="{ position: 'fixed' }">
    <transition name="fade">
      <img
        v-if="logos.length"
        :key="currentSum"
        :style="{ position: 'absolute', width: '100%', height: '100%', 'object-fit': 'contain' }"
        :src="currentURL"
      >
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Asset } from '@gtam-layouts/types';
import { replicantNS } from '@gtam-layouts/browser_shared/replicant_store';

@Component
export default class SponsorLogos extends Vue {
  @replicantNS.State((s) => s.reps.assetsSponsorLogos) readonly logos!: Asset[];
  index = 0;
  currentSum = '';
  currentURL = '';

  created(): void {
    this.showNextLogo();
  }

  showNextLogo(): void {
    if (!this.logos.length) {
      setTimeout(this.showNextLogo, 5 * 1000);
      return;
    }
    this.currentSum = this.logos[this.index].sum;
    this.currentURL = this.logos[this.index].url;
    setTimeout(this.showNextLogo, 60 * 1000);
    this.index = (this.logos.length <= this.index + 1) ? 0 : this.index + 1;
  }
}
</script>
