<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="../_misc/layoutbackground.png" />
      <img class="bg" src="./background.png" />
    </div>
    <timer
      :style="{
        left: '1210px',
        top: '1000px',
        width: '208px',
        height: '77px',
        fontSize: '24px',
      }"
    ></timer>
    <estimate
      :style="{
        left: '910px',
        top: '990px',
        width: '259px',
        height: '75px',
        fontWeight: 'regular',
        fontSize: '24px',
      }"
    ></estimate>
    <game
      :style="{
        left: '110px',
        top: '1022px',
        width: '345px',
        height: '50px',
      }"
      :size="40"
    ></game>
    <category
      :style="{
        left: '651px',
        top: '1020px',
        width: '290px',
        height: '50px',
        fontWeight: 'bold',
      }"
      :size="40"
    ></category>
    <player
      :style="{
        left: '1620px',
        top: '1020px',
        width: '285px',
        height: '50px',
      }"
      :size="40"
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

  useHead({ title: '16:9 1 Player' });
</script>

<style>
  @import url('../_misc/common.css');
  @import url('../_misc/Fade.css');
  @import url('../_misc/Flex.css');
</style>
