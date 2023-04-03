<template>
  <div>
    <div class="q-pa-sm" v-if="gameLayouts && gameLayouts.data">
      <QOptionGroup
        v-model="gameLayouts.data!.selected"
        :options="layoutOptions"
        color="primary"
      />
      <QBtn
        color="black"
        label="Switch to selected layout"
        :disable="!gameLayouts.changed"
        @click="gameLayouts?.save"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useReplicant } from 'nodecg-vue-composable';
  import { GameLayouts } from '@gtam-layouts/types/schemas';
  import { computed } from 'vue';
  const gameLayouts = useReplicant<GameLayouts>('gameLayouts', 'gtam-layouts');

  const layoutOptions = computed(() => {
    if (gameLayouts && gameLayouts.data && gameLayouts.data.available) {
      return gameLayouts.data.available.map((option) => ({
        label: option.name,
        value: option.code,
      }));
    } else {
      return [];
    }
  });
</script>
