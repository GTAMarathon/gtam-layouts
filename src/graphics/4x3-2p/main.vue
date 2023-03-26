<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="../_misc/layoutbackground.png" />
      <img class="bg" src="./background.png" />
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
  import { useHead } from '@vueuse/head';
  import Timer from '../_misc/components/Timer.vue';
  import Estimate from '../_misc/components/Estimate.vue';
  import Game from '../_misc/components/Game.vue';
  import Category from '../_misc/components/Category.vue';
  import Player from '../_misc/components/Player.vue';

  useHead({ title: '4:3 2 Player' });
</script>

<style>
  @import url('../_misc/common.css');
  @import url('../_misc/Fade.css');
  @import url('../_misc/Flex.css');
</style>
