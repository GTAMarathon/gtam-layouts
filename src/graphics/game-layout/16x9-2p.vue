<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./backgrounds/16x9-2p.png" />
    </div>
    <timer
      :style="{
        left: '1285px',
        top: '730px',
        width: '635px',
        height: '150px',
        fontSize: '44px',
      }"
    ></timer>
    <estimate
      :style="{
        left: '1285px',
        top: '865px',
        width: '635px',
        height: '74px',
        fontSize: '36px',
      }"
    ></estimate>
    <game
      :style="{
        left: '659px',
        top: '810px',
        width: '600px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="72"
    ></game>
    <category
      :style="{
        left: '652.5px',
        top: '869px',
        width: '615px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="44"
    ></category>
    <player
      :style="{
        left: '12.5px',
        top: '540px',
        width: '611px',
        height: '92px',
        fontSize: '24px',
      }"
      :size="54"
      :team="1"
    ></player>
    <player
      :style="{
        left: '1296.5px',
        top: '540px',
        width: '611px',
        height: '92px',
        fontSize: '24px',
      }"
      :size="54"
      :team="2"
    ></player>
    <media-box
      :style="{
        left: '7.5px',
        bottom: '5px',
        width: '621px',
        height: '439px',
        fontSize: '34px',
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

  const sponsorImages = useAssetReplicant(
    'sponsor-logos',
    'gtam-layouts'
  );
  const merchImages = useAssetReplicant(
    'merch-images',
    'gtam-layouts'
  );
</script>

<style>
  @import url('../_misc/common.css');
  @import url('../_misc/Fade.css');
  @import url('../_misc/Flex.css');
</style>
