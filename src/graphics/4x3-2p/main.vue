<template>
  <div>
    <img src="./background.png">
    <timer
      :style="{
        left: '516px',
        top: '578px',
        width: '259px',
        height: '75px',
      }"
    />
    <game
      :style="{
        left: '100px',
        top: '578px',
        width: '400px',
        height: '75px',
      }"
	  :run="runDataActiveRun"
    />
    <player
      :style="{
        left: '60px',
        top: '73px',
        width: '259px',
        height: '75px',
      }"
      :team="1"
    />
    <player
      :style="{
        left: '960px',
        top: '73px',
        width: '259px',
        height: '75px',
      }"
      :team="2"
    />
    <host
      :style="{
        left: '741px',
        top: '578px',
        width: '259px',
        height: '75px',
      }"
    />
    <donation-total
      :style="{
        left: '970px',
        top: '578px',
        width: '259px',
        height: '75px',
      }"
    />
    <donations
      :style="{
        left: '130px',
        top: '638px',
        width: '1000px',
        height: '75px',
      }"
    />
    <sponsor-logos
      :style="{
        left: '61px',
        top: '5px',
        width: '112px',
        height: '79px',
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
