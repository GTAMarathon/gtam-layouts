<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./backgrounds/4x3-4p.png" />
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
        left: '643px',
        top: '331px',
        width: '634px',
        height: '75px',
        fontWeight: 'bold',
      }"
      :size="72"
    ></game>
    <category
      :style="{
        left: '643px',
        top: '390px',
        width: '634px',
        height: '75px',
        fontWeight: 'bold',
      }"
      :size="44"
    ></category>
    <player
      :style="{
        left: '0px',
        top: '440px',
        width: '614px',
        height: '81px',
      }"
      :size="36"
      :team="1"
    ></player>
    <player
      :style="{
        left: '1306px',
        top: '440px',
        width: '614px',
        height: '81px',
      }"
      :size="36"
      :team="2"
    ></player>
    <player
      :style="{
        left: '0px',
        top: '949px',
        width: '614px',
        height: '81px',
      }"
      :size="36"
      :team="3"
    ></player>
    <player
      :style="{
        left: '1306px',
        top: '949px',
        width: '614px',
        height: '81px',
      }"
      :size="36"
      :team="4"
    ></player>
    <media-box
      :style="{
        left: '625.5px',
        bottom: '75px',
        width: '669px',
        height: '245px',
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
