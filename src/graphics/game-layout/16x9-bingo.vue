<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./backgrounds/16x9-bingo.png" />
    </div>
    <timer
      :style="{
        left: '777px',
        top: '557px',
        width: '366px',
        height: '80px',
        'font-size': '32px',
      }"
    ></timer>
    <estimate
      :style="{
        left: '777px',
        top: '630px',
        width: '366px',
        height: '55px',
        'font-weight': 'regular',
        'font-size': '28px',
      }"
    ></estimate>
    <game
      :style="{
        left: '798px',
        top: '246px',
        width: '326px',
        height: '65px',
        fontWeight: 'bold',
      }"
      :size="72"
    ></game>
    <category
      :style="{
        left: '798px',
        top: '320px',
        width: '326px',
        height: '50px',
        fontWeight: 'bold',
      }"
      :size="44"
    ></category>
    <player
      :style="{
        left: '0px',
        top: '412px',
        width: '768px',
        height: '107px',
      }"
      :size="50"
      :team="1"
    ></player>
    <player
      :style="{
        left: '1152px',
        top: '412px',
        width: '768px',
        height: '107px',
      }"
      :size="50"
      :team="2"
    ></player>
    <player
      :style="{
        left: '0px',
        top: '918px',
        width: '768px',
        height: '107px',
      }"
      :size="50"
      :team="3"
    ></player>
    <media-box
      :style="{
        left: '780.5px',
        bottom: '75px',
        width: '360px',
        height: '249px',
        fontSize: '30px',
      }"
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
</script>

<style>
  @import url('../_misc/common.css');
  @import url('../_misc/Fade.css');
  @import url('../_misc/Flex.css');
</style>
