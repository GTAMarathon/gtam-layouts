<template>
  <div
    ref="Donation"
    :style="{ overflow: 'hidden' }"
  >
    <b>New Donation:</b> {{ text }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Prop } from 'vue-property-decorator';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

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

    gsap.to(this.donation, {
      duration: time,
      scrollTo: { x: 'max' },
      delay: 2,
      ease: 'none',
      onComplete: () => {
        setTimeout(() => this.$emit('end'), 2 * 1000);
      },
    });
  }
}
</script>
