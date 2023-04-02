<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./backgrounds/layoutbackground.png" />
      <img class="bg" src="./backgrounds/16x9-3p.png" />
    </div>
    <timer
      :style="{
        left: '1656px',
        top: '913px',
        width: '259px',
        height: '77px',
        fontSize: '26px',
      }"
    ></timer>
    <estimate
      :style="{
        left: '1385px',
        top: '952px',
        width: '259px',
        height: '100px',
        fontWeight: 'regular',
        fontSize: '24px',
      }"
    ></estimate>
    <game
      :style="{
        left: '1080px',
        top: '828px',
        width: '330px',
        height: '58px',
        fontWeight: 'bold',
      }"
    ></game>
    <category
      :style="{
        left: '1605px',
        top: '827px',
        width: '300px',
        height: '54px',
        fontWeight: 'bold',
      }"
    ></category>
    <player
      :style="{
        left: '1000px',
        top: '40px',
        width: '300px',
        height: '100px',
      }"
      :size="46"
      :team="1"
    ></player>
    <player
      :style="{
        left: '1000px',
        top: '950px',
        width: '300px',
        height: '100px',
      }"
      :size="46"
      :team="2"
    ></player>
    <player
      :style="{
        left: '1540px',
        top: '160px',
        width: '300px',
        height: '100px',
      }"
      :size="46"
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
