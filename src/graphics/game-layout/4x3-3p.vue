<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./backgrounds/4x3-3p.png" />
    </div>
    <timer
      :style="{
        left: '1314px',
        top: '745px',
        width: '606px',
        height: '125px',
        'font-size': '45px',
      }"
    ></timer>
    <estimate
      :style="{
        left: '1314px',
        top: '855px',
        width: '606px',
        height: '75px',
        fontWeight: 'regular',
        'font-size': '32px',
      }"
    ></estimate>
    <game
      :style="{
        left: '740px',
        top: '230px',
        width: '440px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="56"
    ></game>
    <category
      :style="{
        left: '740px',
        top: '280px',
        width: '440px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="48"
    ></category>
    <player
      :style="{
        left: '0px',
        top: '541px',
        width: '593px',
        height: '91px',
        fontWeight: 'bold',
      }"
      :size="50"
      :team="1"
    ></player>
    <player
      :style="{
        left: '720px',
        top: '450px',
        width: '479px',
        height: '91px',
        fontWeight: 'bold',
      }"
      :size="50"
      :team="2"
    ></player>
    <player
      :style="{
        left: '1314px',
        top: '541px',
        width: '606px',
        height: '91px',
        fontWeight: 'bold',
      }"
      :size="50"
      :team="3"
    ></player>
    <media-box
      :style="{
        left: '0px',
        bottom: '0px',
        width: '555px',
        height: '420px',
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
