<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./backgrounds/layoutbackground.png" />
      <img class="bg" src="./backgrounds/4x3-2p.png" />
    </div>
    <timer
      :style="{
        left: '950px',
        top: '907px',
        width: '259px',
        height: '75px',
        'font-size': '26px',
      }"
    ></timer>
    <estimate
      :style="{
        left: '680px',
        top: '960px',
        width: '259px',
        height: '75px',
        'font-weight': 'regular',
        'font-size': '22px',
      }"
    ></estimate>
    <game
      :style="{
        left: '500px',
        top: '770px',
        width: '450px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="55"
    ></game>
    <category
      :style="{
        left: '975px',
        top: '770px',
        width: '450px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="55"
    ></category>
    <player
      :style="{
        left: '30px',
        top: '770px',
        width: '450px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="50"
      :team="1"
    ></player>
    <player
      :style="{
        left: '1445px',
        top: '770px',
        width: '450px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="50"
      :team="2"
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
