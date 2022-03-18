<template>
  <div
    class="Flex"
    :style="{ 'font-size': '2em', position: 'fixed' }"
  >
    <img
      src="../stc.png"
      :style="{ 'margin-right': '10px' }"
    >
    <div id="Total">
      <span
        v-for="char in total.split('')"
        :key="`${Math.random()}${char}`"
        :class="(char === ',' ? 'Comma' : undefined)"
      >
        {{ char }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { gsap } from 'gsap';
import { DonationTotal as DonationTotalType } from '@gtam-layouts/types/schemas';
import { replicantNS } from '@gtam-layouts/browser_shared/replicant_store';

@Component
export default class DonationTotal extends Vue {
  @replicantNS.State((s) => s.reps.donationTotal) readonly donationTotal!: DonationTotalType;
  tweened = 0;
  created(): void {
    this.tweened = this.donationTotal;
  }

  @Watch('donationTotal')
  onTotalChange(newVal: DonationTotalType, oldVal: DonationTotalType): void {
    const data = { total: oldVal };
    gsap.to(data, {
      duration: 1,
      total: newVal,
      ease: 'none',
      onUpdate: () => {
        this.tweened = data.total;
      },
    });
  }

  get total(): string {
    return `$${this.tweened.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
}
</script>

<style scoped>
  /* Each character in the total is in a span; setting width so the numbers appear monospaced. */
  #Total > span {
    display: inline-block;
    width: 0.45em;
    text-align: center;
  }
  #Total > .Comma {
    display: inline-block;
    width: 0.22em;
    text-align: center;
  }
</style>
