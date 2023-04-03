<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./img/annual_hundo.png" />
      <img class="bg" src="./img/annual_hundo_plates.png" />
    </div>
    <timer
      :style="{
        left: '145px',
        top: '750px',
        width: '450px',
        height: '112px',
        'font-size': '32px',
      }"
    ></timer>
    <player
      :style="{
        left: '221px',
        top: '494px',
        width: '300px',
        height: '62px',
      }"
      :size="45"
    ></player>
    <player
      :style="{
        left: '1030px',
        top: '381px',
        width: '300px',
        height: '62px',
      }"
      :size="45"
      :team="2"
    ></player>
    <player
      :style="{
        left: '1620px',
        top: '381px',
        width: '300px',
        height: '62px',
      }"
      :size="45"
      :team="3"
    ></player>
    <player
      :style="{
        left: '1030px',
        top: '824px',
        width: '300px',
        height: '62px',
      }"
      :size="45"
      :team="4"
    ></player>
    <player
      :style="{
        left: '1620px',
        top: '824px',
        width: '300px',
        height: '62px',
      }"
      :size="45"
      :team="5"
    ></player>
    <completion-table
      :style="{
        width: '1921px',
        height: '193px',
        bottom: '0px',
      }"
    ></completion-table>
  </div>
</template>

<script setup lang="ts">
  import Timer from './components/Timer.vue';
  import Player from './components/Player.vue';
  import 'bootstrap';
  import 'bootstrap/dist/css/bootstrap.min.css';
</script>

<style>
  @import url('../_misc/Fade.css');
  @import url('../_misc/Flex.css');
  @import url('./css/style.css');
</style>
