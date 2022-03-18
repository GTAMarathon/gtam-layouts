<template>
  <div
    class="Flex"
    :style="{
      position: 'fixed',
      'font-size': '1.5em',
      'box-sizing': 'border-box',
      padding: '0 10px',
      'white-space': 'nowrap',
      overflow: 'hidden',
    }"
  >
    <transition
      name="fade"
      mode="out-in"
    >
      <component
        :is="component"
        :key="text"
        :text="text"
        @end="onEnd"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Donation from './Ticker/Donation.vue';

interface DonationObj {
  donor_visiblename: string;
  amount: string;
  comment: string;
}

@Component({
  components: {
    Donation,
  },
})
export default class Ticker extends Vue {
  text = '';
  component: typeof Donation | null = null;
  donations: DonationObj[] = [];
  showingDonations = false;

  created(): void {
    nodecg.listenFor('newDonation', (donation: DonationObj) => {
      this.donations.push(donation);
      if (!this.showingDonations) {
        this.showNextDonation();
      }
    });
  }

  showNextDonation(): void {
    this.component = Donation;
    const donation = this.donations[0];
    this.showingDonations = true;
    this.text = `${donation.donor_visiblename} ($${parseFloat(donation.amount).toFixed(2)})`
      + `${(donation.comment) ? ` - ${donation.comment}` : ''}`;
    this.donations.shift();
  }

  onEnd(): void {
    if (!this.donations.length) {
      this.showingDonations = false;
      this.text = '';
      this.component = null;
    } else {
      this.showNextDonation();
    }
  }
}
</script>
