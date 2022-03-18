<template>
  <div>
    <img src="./background.png">
    <timer
      :style="{
        left: '548px',
        top: '160px',
        width: '191px',
        height: '67px',
      }"
    />
    <game
      :style="{
        left: '548px',
        top: '82px',
        width: '191px',
        height: '67px',
      }"
      :scale="0.8"
	  :run="runDataActiveRun"
    />
    <player
      :style="{
        left: '1px',
        top: '17px',
        width: '327px',
        height: '51px',
      }"
      :team="1"
    />
    <player
      :style="{
        left: '955px',
        top: '17px',
        width: '327px',
        height: '51px',
      }"
      :team="2"
    />
    <player
      :style="{
        left: '1px',
        top: '590px',
        width: '327px',
        height: '51px',
      }"
      :team="3"
    />
    <player
      :style="{
        left: '955px',
        top: '590px',
        width: '327px',
        height: '51px',
      }"
      :team="4"
    />
    <host
      :style="{
        left: '544px',
        top: '365px',
        width: '191px',
        height: '67px',
      }"
    />
    <donation-total
      :style="{
        left: '544px',
        top: '443px',
        width: '191px',
        height: '67px',
      }"
    />
    <donations
      :style="{
        left: '40px',
        top: '660px',
        width: '1200px',
        height: '52px',
      }"
    />
    <sponsor-logos
      :style="{
        left: '577px',
        top: '543px',
        width: '130px',
        height: '75px',
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
