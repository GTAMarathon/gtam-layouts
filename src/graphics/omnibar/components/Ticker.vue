<template>
  <div
    id="Ticker"
    :style="{
      overflow: 'hidden',
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }"
  >
    <transition
      enter-active-class="animate__animated animate__slideInDown"
      leave-active-class="animate__animated animate__slideOutDown"
      mode="out-in"
      ><component
        :is="currentComponent.name"
        :key="timestamp"
        :data="currentComponent.data"
        @end="showNextMsg"
    /></transition>
  </div>
</template>

<script setup lang="ts">
  import { $ref } from 'vue/macros';
  import GenericMessage from './Ticker/GenericMessage.vue';
  import NextRun from './Ticker/NextRun.vue';
  import { onMounted } from 'vue';
  import { Configschema } from '@gtam-layouts/types/schemas';
  import {
    RunDataActiveRun,
    RunDataArray,
  } from 'speedcontrol/types';

  const runs = nodecg.Replicant<RunDataArray>(
    'runDataArray',
    'nodecg-speedcontrol'
  );
  const activeRun = nodecg.Replicant<RunDataActiveRun>(
    'runDataActiveRun',
    'nodecg-speedcontrol'
  );
  const currentOBSScene = nodecg.Replicant<string>('currentOBSScene');
  const intermission = (nodecg.bundleConfig as Configschema).obs.names.scenes
    .intermission;

  let currentComponent = $ref<{ name: any; data: Object }>({
    name: '',
    data: {},
  });
  let currentComponentIndex = 0;
  let timestamp = $ref(Date.now());
  let messageTypes: any[] = [];
  let intermissionMessageTypes: any[] = [];

  onMounted(() => {
    NodeCG.waitForReplicants(runs, activeRun, currentOBSScene).then(() => {
      messageTypes = [gtuPromo(), merchPromo(), schedulePromo(), nextRun()];
      intermissionMessageTypes = [gtuPromo(), merchPromo(), schedulePromo()];
      currentComponent = messageTypes[0];
    });
  });

  function showNextMsg() {
    console.log('SHOWING NEXT MESSAGE');
    if (currentOBSScene.value != intermission) {
      currentComponentIndex += 1;
      if (currentComponentIndex >= messageTypes.length) {
        currentComponentIndex = 0;
      }
      currentComponent = messageTypes[currentComponentIndex];
    } else {
      currentComponentIndex += 1;
      if (currentComponentIndex >= intermissionMessageTypes.length) {
        currentComponentIndex = 0;
      }
      currentComponent = intermissionMessageTypes[currentComponentIndex];
    }

    timestamp = Date.now();
  }

  function genericMsg(msg: string) {
    return {
      name: GenericMessage,
      data: {
        msg,
      },
    };
  }

  function gtuPromo() {
    return genericMsg(
      'Welcome to <span class="highlight">GTAMarathon 2024</span>! Enjoy the show!'
    );
  }

  function merchPromo() {
    return genericMsg(
      'Check out the merch store over at <span class="highlight">store.streamelements.com/gtamarathon</span>!'
    );
  }
  function schedulePromo() {
    return genericMsg(
      `Type <span class="highlight">!schedule</span> in the chat to see what's on next!`
    );
  }

  function nextRun() {
    return {
      name: NextRun,
    };
  }
</script>
