<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="../_misc/layoutbackground.png" />
      <img class="bg" src="./background.png" />
    </div>
    <timer
      :style="{
        left: '1345px',
        top: '987px',
        width: '259px',
        height: '75px',
        'font-size': '26px',
      }"
    ></timer>
    <estimate
      :style="{
        left: '1070px',
        top: '973px',
        width: '259px',
        height: '85px',
        'font-weight': 'regular',
        'font-size': '24px',
      }"
    ></estimate>
    <game
      :style="{
        left: '280px',
        top: '1006px',
        width: '338px',
        height: '50px',
        fontWeight: 'bold',
      }"
      :size="40"
    ></game>
    <category
      :style="{
        left: '812px',
        top: '1008px',
        width: '298px',
        height: '50px',
        fontWeight: 'bold',
      }"
      :size="40"
    ></category>
    <player
      :style="{
        left: '1437px',
        top: '230px',
        width: '280px',
        height: '55px',
      }"
      :size="45"
      :team="2"
    ></player>
    <player
      :style="{
        left: '182px',
        top: '891px',
        width: '280px',
        height: '55px',
      }"
      :size="45"
      :team="1"
    ></player>
    <player
      :style="{
        left: '823px',
        top: '887px',
        width: '280px',
        height: '55px',
      }"
      :size="45"
      :team="3"
    ></player>
    <player
      :style="{
        left: '1461px',
        top: '887px',
        width: '280px',
        height: '55px',
      }"
      :size="45"
      :team="4"
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

  useHead({ title: '16:9 4 Player' });
</script>

<style>
  @import url('../_misc/common.css');
  @import url('../_misc/Fade.css');
  @import url('../_misc/Flex.css');
</style>
