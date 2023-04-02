<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./backgrounds/layoutbackground.png" />
      <img class="bg" src="./backgrounds/16x9-2p.png" />
    </div>
    <timer
      :style="{
        left: '955px',
        top: '900px',
        width: '259px',
        height: '77px',
        fontSize: '26px',
      }"
    ></timer>
    <estimate
      :style="{
        left: '697px',
        top: '950px',
        width: '208px',
        height: '74px',
        fontSize: '24px',
      }"
    ></estimate>
    <game
      :style="{
        left: '750px',
        top: '595px',
        width: '445px',
        height: '100px',
        fontSize: '30px',
      }"
      :size="50"
    ></game>
    <category
      :style="{
        left: '750px',
        top: '765px',
        width: '448px',
        height: '122px',
        fontSize: '32px',
      }"
      :size="52"
    ></category>
    <player
      :style="{
        left: '20px',
        top: '595px',
        width: '450px',
        height: '100px',
        fontSize: '24px',
      }"
      :size="46"
      :team="1"
    ></player>
    <player
      :style="{
        left: '1447px',
        top: '595px',
        width: '450px',
        height: '100px',
        fontSize: '24px',
      }"
      :size="46"
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
