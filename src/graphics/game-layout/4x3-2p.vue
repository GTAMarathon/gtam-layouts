<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./backgrounds/4x3-2p.png" />
    </div>
    <timer
      :style="{
        left: '1285px',
        top: '785px',
        width: '635px',
        height: '150px',
        'font-size': '36px',
      }"
    ></timer>
    <estimate
      :style="{
        left: '1285px',
        top: '905px',
        width: '635px',
        height: '75px',
        'font-weight': 'regular',
        'font-size': '30px',
      }"
    ></estimate>
    <game
      :style="{
        left: '659px',
        top: '824px',
        width: '600px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="72"
    ></game>
    <category
      :style="{
        left: '652.5px',
        top: '890px',
        width: '615px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="44"
    ></category>
    <player
      :style="{
        left: '12.5px',
        top: '703px',
        width: '610px',
        height: '85px',
        fontWeight: 'bold',
      }"
      :size="40"
      :team="1"
    ></player>
    <player
      :style="{
        left: '1297.5px',
        top: '703px',
        width: '610px',
        height: '85px',
        fontWeight: 'bold',
      }"
      :size="40"
      :team="2"
    ></player>
    <media-box
      :style="{
        left: '7.5px',
        bottom: '75px',
        width: '621px',
        height: '226px',
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
