<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./backgrounds/layoutbackground.png" />
      <img class="bg" src="./backgrounds/16x9-1p.png" />
    </div>
    <timer
      :style="{
        left: '1210px',
        top: '1000px',
        width: '208px',
        height: '77px',
        fontSize: '24px',
      }"
    ></timer>
    <estimate
      :style="{
        left: '910px',
        top: '990px',
        width: '259px',
        height: '75px',
        fontWeight: 'regular',
        fontSize: '24px',
      }"
    ></estimate>
    <game
      :style="{
        left: '110px',
        top: '1022px',
        width: '345px',
        height: '50px',
      }"
      :size="40"
    ></game>
    <category
      :style="{
        left: '651px',
        top: '1020px',
        width: '290px',
        height: '50px',
        fontWeight: 'bold',
      }"
      :size="40"
    ></category>
    <player
      :style="{
        left: '1620px',
        top: '1020px',
        width: '285px',
        height: '50px',
      }"
      :size="40"
      :team="1"
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
