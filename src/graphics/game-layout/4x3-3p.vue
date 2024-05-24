<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./backgrounds/4x3-3p.png" />
    </div>
    <timer
      :style="{
        left: '1304px',
        top: '705px',
        width: '606px',
        height: '125px',
        'font-size': '45px',
      }"
    ></timer>
    <estimate
      :style="{
        left: '1304px',
        top: '815px',
        width: '606px',
        height: '75px',
        fontWeight: 'regular',
        'font-size': '32px',
      }"
    ></estimate>
    <game
      :style="{
        left: '700px',
        top: '720px',
        width: '520px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="80"
    ></game>
    <category
      :style="{
        left: '700px',
        top: '780px',
        width: '520px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="50"
    ></category>
    <player
      :style="{
        left: '0px',
        top: '471px',
        width: '643px',
        height: '81px',
        fontWeight: 'bold',
      }"
      :size="50"
      :team="1"
    ></player>
    <player
      :style="{
        left: '643px',
        top: '471px',
        width: '640px',
        height: '81px',
        fontWeight: 'bold',
      }"
      :size="50"
      :team="2"
    ></player>
    <player
      :style="{
        left: '1280px',
        top: '471px',
        width: '640px',
        height: '81px',
        fontWeight: 'bold',
      }"
      :size="50"
      :team="3"
    ></player>
    <media-box
      :style="{
        left: '7.5px',
        bottom: '90px',
        width: '620px',
        height: '415px',
        fontSize: '34px',
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
