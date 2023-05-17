<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./backgrounds/16x9-1p.png" />
    </div>
    <timer
      :style="{
        left: '1377px',
        top: '864px',
        width: '550px',
        height: '130px',
        fontSize: '36px',
      }"
    ></timer>
    <estimate
      :style="{
        left: '1377px',
        top: '975px',
        width: '550px',
        height: '80px',
        fontWeight: 'regular',
        fontSize: '32px',
      }"
    ></estimate>
    <game
      :style="{
        left: '384px',
        top: '909px',
        width: '985px',
        height: '80px',
      }"
      :size="72"
    ></game>
    <category
      :style="{
        left: '384px',
        top: '990px',
        width: '985px',
        height: '50px',
        fontWeight: 'bold',
      }"
      :size="48"
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
        bottom: '5px',
        width: '365px',
        height: '738px',
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
