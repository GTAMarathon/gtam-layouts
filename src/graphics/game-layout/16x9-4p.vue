<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./backgrounds/16x9-4p.png" />
    </div>
    <timer
      :style="{
        left: '777px',
        top: '547px',
        width: '366px',
        height: '80px',
        'font-size': '32px',
      }"
    ></timer>
    <estimate
      :style="{
        left: '777px',
        top: '620px',
        width: '366px',
        height: '55px',
        'font-weight': 'regular',
        'font-size': '28px',
      }"
    ></estimate>
    <game
      :style="{
        left: '777px',
        top: '246px',
        width: '366px',
        height: '65px',
        fontWeight: 'bold',
      }"
      :size="72"
    ></game>
    <category
      :style="{
        left: '777px',
        top: '320px',
        width: '366px',
        height: '50px',
        fontWeight: 'bold',
      }"
      :size="44"
    ></category>
    <player
      :style="{
        left: '0px',
        top: '432px',
        width: '768px',
        height: '107px',
      }"
      :size="50"
      :team="1"
    ></player>
    <player
      :style="{
        left: '1152px',
        top: '432px',
        width: '768px',
        height: '107px',
      }"
      :size="50"
      :team="2"
    ></player>
    <player
      :style="{
        left: '0px',
        top: '973px',
        width: '768px',
        height: '107px',
      }"
      :size="50"
      :team="3"
    ></player>
    <player
      :style="{
        left: '1152px',
        top: '973px',
        width: '768px',
        height: '107px',
      }"
      :size="50"
      :team="4"
    ></player>
    <media-box
      :style="{
        left: '779.5px',
        bottom: '5px',
        width: '360px',
        height: '319px',
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
