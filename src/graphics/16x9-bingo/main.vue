<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="../_misc/layoutbackground.png" />
      <img class="bg" src="./background.png" />
    </div>
    <timer
      :style="{
        left: '1693px',
        top: '537px',
        width: '259px',
        height: '75px',
        'font-size': '20px',
      }"
    ></timer>
    <estimate
      :style="{
        left: '1525px',
        top: '530px',
        width: '259px',
        height: '75px',
        'font-weight': 'regular',
        'font-size': '20px',
      }"
    ></estimate>
    <game
      :style="{
        left: '1034px',
        top: '554px',
        width: '180px',
        height: '50px',
        fontWeight: 'bold',
      }"
      :size="40"
    ></game>
    <category
      :style="{
        left: '1380px',
        top: '553px',
        width: '195px',
        height: '52px',
        fontWeight: 'bold',
      }"
      :size="42"
    ></category>
    <player
      :style="{
        left: '968px',
        top: '1015px',
        width: '270px',
        height: '52px',
        fontWeight: 'bold',
      }"
      :size="40"
      :team="1"
    ></player>
    <player
      :style="{
        left: '1300px',
        top: '1015px',
        width: '270px',
        height: '52px',
        fontWeight: 'bold',
      }"
      :size="40"
      :team="2"
    ></player>
    <player
      :style="{
        left: '1630px',
        top: '1015px',
        width: '270px',
        height: '52px',
        fontWeight: 'bold',
      }"
      :size="40"
      :team="3"
    ></player>
  </div>
</template>

<script setup lang="ts">
  import { useHead } from '@vueuse/head';
  import Timer from '../_misc/components/Timer.vue';
  import Estimate from '../_misc/components/Estimate.vue';
  import Game from '../_misc/components/Game.vue';
  import Category from '../_misc/components/Category.vue';
  import Player from '../_misc/components/Player.vue';

  useHead({ title: '16:9 Bingo' });
</script>

<style>
  @import url('../_misc/common.css');
  @import url('../_misc/Fade.css');
  @import url('../_misc/Flex.css');
</style>
