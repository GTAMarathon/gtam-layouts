<template>
  <div>
    <img src="./background.png">
    <timer
      :style="{
        left: '1210px',
        top: '1000px',
        width: '208px',
        height: '77px',
		'font-size': '24px',
      }"
    ></timer>
	<estimate
      :style="{
        left: '910px',
        top: '990px',
        width: '259px',
        height: '75px',
		'font-weight': regular,
		'font-size': '24px',
      }"
    ></estimate>
    <game
      :style="{
        left: '35px',
        top: '1008px',
        width: '500px',
        height: '75px',
		'font-size': '24px',
      }"
    ></game>
	<category
      :style="{
        left: '600px',
        top: '1007px',
        width: '400px',
        height: '75px',
		'font-weight': bold,
		'font-size': '30px',
      }"
    ></category>
    <player
      :style="{
        left: '1560px',
        top: '1005px',
        width: '400px',
        height: '75px',
		'font-size': '18px',
      }"
    ></player>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import SponsorLogos from '../_misc/components/SponsorLogos.vue';
import DonationTotal from '../_misc/components/DonationTotal.vue';
import Host from '../_misc/components/Host.vue';
import Donations from '../_misc/components/Ticker.vue';
import Timer from '../_misc/components/Timer.vue';
import Estimate from '../_misc/components/Estimate.vue';
import Game from '../_misc/components/Game.vue';
import Category from '../_misc/components/Category.vue';
import Player from '../_misc/components/Player.vue';
import { RunDataActiveRun } from '../../../../nodecg-speedcontrol/src/types';

@Component({
  components: {
    SponsorLogos,
    DonationTotal,
    Host,
    Donations,
    Timer,
	Estimate,
    Game,
    Category,
    Player,
  },
})
export default class App extends Vue {
  @State runDataActiveRun!: RunDataActiveRun;
}
</script>

<style>
  @import url('../_misc/common.css');
  @import url('../_misc/Fade.css');
  @import url('../_misc/Flex.css');
</style>
