<template>
  <div>
    <img src="./background.png">
    <timer
      :style="{
        left: '25px',
        top: '565px',
        width: '208px',
        height: '77px',
      }"
    />
    <game
      :style="{
        left: '25px',
        top: '480px',
        width: '208px',
        height: '74px',
      }"
	  :run="runDataActiveRun"
    />
    <player
      :style="{
        left: '1010px',
        top: '13px',
        width: '208px',
        height: '75px',
      }"
    />
    <host
      :style="{
        left: '25px',
        top: '393px',
        width: '209px',
        height: '75px',
      }"
    />
    <donation-total
      :style="{
        left: '25px',
        top: '305px',
        width: '209px',
        height: '75px',
      }"
    />
    <donations
      :style="{
        left: '90px',
        top: '635px',
        width: '1100px',
        height: '75px',
      }"
    />
    <sponsor-logos
      :style="{
        left: '95px',
        top: '193px',
        width: '82px',
        height: '81px',
      }"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { replicantNS } from '@gtam-layouts/browser_shared/replicant_store';
import SponsorLogos from '../_misc/components/SponsorLogos.vue';
import DonationTotal from '../_misc/components/DonationTotal.vue';
import Host from '../_misc/components/Host.vue';
import Donations from '../_misc/components/Ticker.vue';
import Timer from '../_misc/components/Timer.vue';
import Game from '../_misc/components/Game.vue';
import Player from '../_misc/components/Player.vue';
import { RunDataActiveRun } from '../../../../nodecg-speedcontrol/src/types';

@Component({
  components: {
    SponsorLogos,
    DonationTotal,
    Host,
    Donations,
    Timer,
    Game,
    Player,
  },
})
export default class App extends Vue {
  @replicantNS.State((s) => s.reps.runDataActiveRun) readonly runDataActiveRun!: RunDataActiveRun;
}
</script>

<style>
  @import url('../_misc/common.css');
  @import url('../_misc/Fade.css');
  @import url('../_misc/Flex.css');
</style>
