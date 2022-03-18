<template>
  <div>
    <img src="./background.png">
    <timer
      :style="{
        left: '523px',
        top: '562px',
        width: '237px',
        height: '74px',
      }"
    />
    <game
      :style="{
        left: '185px',
        top: '564px',
        width: '237px',
        height: '74px',
      }"
	  :run="runDataActiveRun"
    />
    <player
      :style="{
        left: '40px',
        top: '128px',
        width: '237px',
        height: '74px',
      }"
      :team="1"
    />
    <player
      :style="{
        left: '995px',
        top: '128px',
        width: '237px',
        height: '74px',
      }"
      :team="2"
    />
    <host
      :style="{
        left: '750px',
        top: '562px',
        width: '237px',
        height: '74px',
      }"
    />
    <donation-total
      :style="{
        left: '977px',
        top: '562px',
        width: '237px',
        height: '74px',
      }"
    />
    <donations
      :style="{
        left: '143px',
        top: '645px',
        width: '1000px',
        height: '74px',
      }"
    />
    <sponsor-logos
      :style="{
        left: '43px',
        top: '22px',
        width: '90px',
        height: '74px',
      }"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { replicantNS } from '@scm2019-layouts/browser_shared/replicant_store';
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
