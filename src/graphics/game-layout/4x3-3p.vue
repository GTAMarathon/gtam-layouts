<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./backgrounds/layoutbackground.png" />
      <img class="bg" src="./backgrounds/4x3-3p.png" />
    </div>
    <timer
      :style="{
        left: '1422px',
        top: '270px',
        width: '259px',
        height: '75px',
        'font-size': '28px',
      }"
    ></timer>
    <estimate
      :style="{
        left: '1160px',
        top: '325px',
        width: '259px',
        height: '75px',
        fontWeight: 'regular',
        'font-size': '24px',
      }"
    ></estimate>
    <game
      :style="{
        left: '740px',
        top: '210px',
        width: '440px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="56"
    ></game>
    <category
      :style="{
        left: '740px',
        top: '380px',
        width: '440px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="56"
    ></category>
    <player
      :style="{
        left: '717px',
        top: '40px',
        width: '330px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="50"
      :team="1"
    ></player>
    <player
      :style="{
        left: '717px',
        top: '560px',
        width: '330px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="50"
      :team="2"
    ></player>
    <player
      :style="{
        left: '870px',
        top: '940px',
        width: '330px',
        height: '100px',
        fontWeight: 'bold',
      }"
      :size="50"
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
