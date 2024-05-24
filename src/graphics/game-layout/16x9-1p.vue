<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./backgrounds/16x9-1p.png" />
    </div>
    <timer
      :style="{
        left: '1377px',
        top: '844px',
        width: '550px',
        height: '130px',
        fontSize: '30px',
      }"
    ></timer>
    <estimate
      :style="{
        left: '1377px',
        top: '930px',
        width: '550px',
        height: '80px',
        fontWeight: 'regular',
        fontSize: '26px',
      }"
    ></estimate>
    <game
      :style="{
        left: '384px',
        top: '874px',
        width: '985px',
        height: '80px',
      }"
      :size="60"
    ></game>
    <category
      :style="{
        left: '384px',
        top: '945px',
        width: '985px',
        height: '50px',
        fontWeight: 'bold',
      }"
      :size="40"
    ></category>
    <player
      :style="{
        left: '10px',
        top: '240px',
        width: '365px',
        height: '93px',
      }"
      :size="46"
      :team="1"
    ></player>
    <media-box
      :style="{
        left: '7.5px',
        bottom: '75px',
        width: '365px',
        height: '668px',
        fontSize: '30px',
      }"
      use-widescreen-images
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
