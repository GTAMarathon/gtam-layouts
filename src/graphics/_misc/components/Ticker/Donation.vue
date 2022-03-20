<template>
  <div
    ref="Donation"
    :style="{ overflow: 'hidden' }"
  >
    <b>New Donation:</b> {{ text }}
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import { Vue, Component, Ref, Prop } from 'vue-property-decorator';
import { TweenLite, Linear } from 'gsap';
// eslint-disable-next-line
// @ts-ignore
import ScrollToPlugin from 'gsap/ScrollToPlugin';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const plugins = [ScrollToPlugin];

@Component
export default class Donation extends Vue {
  @Prop(String) readonly text!: string;
  @Ref('Donation') readonly donation!: HTMLElement;

  mounted(): void {
    const fullWidth = this.donation.scrollWidth;
    const visibleWidth = this.donation.clientWidth;

    // Display time is minimum of 10s.
    let time = 10;
    if (fullWidth > visibleWidth) {
      const dist = fullWidth - visibleWidth;
      time = ((dist / 100) > 10) ? (dist / 100) : 10;
    }

    TweenLite.to(this.donation, time, {
      scrollTo: { x: 'max' },
      delay: 2,
      ease: Linear.easeNone,
      onComplete: () => {
        setTimeout(() => this.$emit('end'), 2 * 1000);
      },
    });
  }
}
</script>
