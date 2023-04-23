<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./backgrounds/16x9-3p.png" />
    </div>
    <timer
      :style="{
        left: '576px',
        top: '873px',
        width: '768px',
        height: '120px',
        fontSize: '40px',
      }"
    ></timer>
    <estimate
      :style="{
        left: '576px',
        top: '972px',
        width: '768px',
        height: '100px',
        fontWeight: 'regular',
        fontSize: '30px',
      }"
    ></estimate>
    <game
      :style="{
        left: '1361.5px',
        top: '605px',
        width: '545px',
        height: '200px',
        fontWeight: 'bold',
      }"
    ></game>
    <category
      :style="{
        left: '1361.5px',
        top: '675px',
        width: '545px',
        height: '200px',
        fontWeight: 'bold',
      }"
      :size="48"
    ></category>
    <player
      :style="{
        left: '7.5px',
        top: '430px',
        width: '557px',
        height: '94px',
      }"
      :size="52"
      :team="1"
    ></player>
    <player
      :style="{
        left: '1355.5px',
        top: '430px',
        width: '557px',
        height: '94px',
      }"
      :size="52"
      :team="2"
    ></player>
    <player
      :style="{
        left: '775.5px',
        top: '341px',
        width: '370px',
        height: '92px',
      }"
      :size="52"
      :team="3"
    ></player>
    <media-box
      :style="{
        left: '0px',
        bottom: '0px',
        width: '540px',
        height: '520px',
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
