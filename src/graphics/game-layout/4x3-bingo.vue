<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./backgrounds/layoutbackground.png" />
      <img class="bg" src="./backgrounds/4x3-bingo.png" />
    </div>
    <timer
      :style="{
        left: '140px',
        top: '972px',
        width: '259px',
        height: '75px',
        'font-size': '22px',
      }"
    ></timer>
    <estimate
      :style="{
        left: '-55px',
        top: '965px',
        width: '259px',
        height: '75px',
        'font-weight': 'regular',
        'font-size': '20px',
      }"
    ></estimate>
    <game
      :style="{
        left: '15px',
        top: '650px',
        width: '440px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="55"
    ></game>
    <category
      :style="{
        left: '15px',
        top: '815px',
        width: '440px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="55"
    ></category>
    <player
      :style="{
        left: '20px',
        top: '490px',
        width: '320px',
        height: '80px',
        fontWeight: 'bold',
      }"
      :size="50"
      :team="1"
    ></player>
    <player
      :style="{
        left: '655px',
        top: '490px',
        width: '320px',
        height: '80px',
        fontWeight: 'bold',
      }"
      :size="50"
      :team="2"
    ></player>
    <player
      :style="{
        left: '1290px',
        top: '490px',
        width: '320px',
        height: '80px',
        fontWeight: 'bold',
      }"
      :size="50"
      :team="3"
    ></player>
  </div>
</template>

<script setup lang="ts">
  import Timer from './components/Timer.vue';
  import Estimate from './components/Estimate.vue';
  import Game from './components/Game.vue';
  import Category from './components/Category.vue';
  import Player from './components/Player.vue';
</script>

<style>
  @import url('../_misc/common.css');
  @import url('../_misc/Fade.css');
  @import url('../_misc/Flex.css');
</style>
