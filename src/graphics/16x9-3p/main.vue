<template>
  <div>
    <img src="./background.png">
    <timer
      :style="{
        left: '250px',
        top: '410px',
        width: '211px',
        height: '75px',
      }"
    />
    <game
      :style="{
        left: '40px',
        top: '410px',
        width: '211px',
        height: '75px',
      }"
    />
    <player
      :style="{
        left: '398px',
        top: '342px',
        width: '197px',
        height: '31px',
      }"
      small
      :team="1"
    />
    <player
      :style="{
        left: '1008px',
        top: '342px',
        width: '197px',
        height: '31px',
      }"
      small
      :team="2"
    />
    <player
      :style="{
        left: '686px',
        top: '347px',
        width: '197px',
        height: '31px',
      }"
      small
      :team="3"
    />
    <host
      :style="{
        left: '36px',
        top: '505px',
        width: '211px',
        height: '75px',
      }"
    />
    <donation-total
      :style="{
        left: '250px',
        top: '503px',
        width: '211px',
        height: '75px',
      }"
    />
    <donations
      :style="{
        left: '250px',
        top: '590px',
        width: '380px',
        height: '75px',
      }"
    />
    <sponsor-logos
      :style="{
        left: '459px',
        top: '449px',
        width: '188px',
        height: '100px',
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
