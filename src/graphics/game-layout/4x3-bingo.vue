<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./backgrounds/4x3-bingo.png" />
    </div>
    <timer
      :style="{
        left: '745px',
        top: '527px',
        width: '426px',
        height: '100px',
        'font-size': '40px',
      }"
    ></timer>
    <estimate
      :style="{
        left: '628px',
        top: '625px',
        width: '664px',
        height: '75px',
        'font-weight': 'regular',
        'font-size': '32px',
      }"
    ></estimate>
    <game
      :style="{
        left: '628px',
        top: '261px',
        width: '664px',
        height: '75px',
        fontWeight: 'bold',
      }"
      :size="72"
    ></game>
    <category
      :style="{
        left: '628px',
        top: '320px',
        width: '664px',
        height: '75px',
        fontWeight: 'bold',
      }"
      :size="44"
    ></category>
    <player
      :style="{
        left: '0px',
        top: '459px',
        width: '614px',
        height: '81px',
      }"
      :size="50"
      :team="1"
    ></player>
    <player
      :style="{
        left: '1306px',
        top: '459px',
        width: '614px',
        height: '81px',
      }"
      :size="50"
      :team="2"
    ></player>
    <player
      :style="{
        left: '0px',
        top: '999px',
        width: '614px',
        height: '81px',
      }"
      :size="50"
      :team="3"
    ></player>
    <media-box
      :style="{
        left: '625.5px',
        bottom: '5px',
        width: '669px',
        height: '319px',
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
