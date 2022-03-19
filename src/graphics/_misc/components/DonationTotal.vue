<template>
  <div
    class="Flex"
    :style="{ 'font-size': '2em', position: 'fixed' }"
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
import { TweenLite, Linear } from 'gsap'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { State } from 'vuex-class';
import { DonationTotal as DonationTotalType } from '../../../types/schemas';

@Component
export default class DonationTotal extends Vue {
  @State donationTotal!: DonationTotalType;
  tweened = 0;
  created(): void {
    this.tweened = this.donationTotal;
  }

  @Watch('donationTotal')
  onTotalChange(newVal: DonationTotalType, oldVal: DonationTotalType): void {
    TweenLite.to({ total: oldVal }, 1, {
      total: newVal,
      ease: Linear.easeNone,
      onUpdateParams: ['{self}'],
      onUpdate: (self: { target: { total: number }}) => {
        this.tweened = self.target.total;
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
