<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./backgrounds/4x3-1p.png" />
    </div>
    <timer
      :style="{
        left: '0px',
        top: '476px',
        width: '476px',
        height: '75px',
        'font-size': '26px',
      }"
    ></timer>
    <estimate
      :style="{
        left: '0px',
        top: '542px',
        width: '476px',
        height: '65px',
        'font-weight': 'regular',
        'font-size': '24px',
      }"
    ></estimate>
    <game
      :style="{
        left: '12.5px',
        top: '342px',
        width: '451px',
        height: '75px',
        fontWeight: 'bold',
      }"
      :size="65"
    ></game>
    <category
      :style="{
        left: '0px',
        top: '400px',
        width: '476px',
        height: '62px',
        fontWeight: 'bold',
      }"
      :size="37"
    ></category>
    <player
      :style="{
        left: '12.5px',
        top: '241px',
        width: '451px',
        height: '91px',
        fontWeight: 'bold',
      }"
      :size="56"
      :team="1"
    ></player>
    <media-box
      :style="{
        left: '0px',
        bottom: '0px',
        width: '446px',
        height: '434px',
        fontSize: '30px',
      }"
      :sponsor-images="sponsorImages"
      :merch-images="merchImages"
    />
  </div>
</template>

<script setup lang="ts">
  import Timer from './components/Timer.vue';
  import Estimate from './components/Estimate.vue';
  import Game from './components/Game.vue';
  import Category from './components/Category.vue';
  import Player from './components/Player.vue';
  import MediaBox from './components/MediaBox.vue';
  import { useAssetReplicant } from 'nodecg-vue-composable';

  const sponsorImages = useAssetReplicant('sponsor-logos', 'gtam-layouts');
  const merchImages = useAssetReplicant('merch-images', 'gtam-layouts');
</script>

<style>
  @import url('../_misc/common.css');
  @import url('../_misc/Fade.css');
  @import url('../_misc/Flex.css');
</style>
