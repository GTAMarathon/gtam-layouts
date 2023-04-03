<template>
  <div id="GameLayout">
    <router-view id="Layout" />
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { GameLayouts } from '@gtam-layouts/types/schemas';
  import { watch } from 'vue';
  import { useReplicant } from 'nodecg-vue-composable';
  import { layoutsList, defaultCode } from './layouts';

  const router = useRouter();

  const gameLayouts = useReplicant<GameLayouts>('gameLayouts', 'gtam-layouts');
  let setUpReplicant = false;

  watch(
    () => gameLayouts?.data,
    async (newVal, oldVal?) => {
      // Set up available game layouts list replicant when first loading the page
      if (gameLayouts?.data?.available && !setUpReplicant) {
        gameLayouts.data.available = layoutsList;
        gameLayouts.save();
        setUpReplicant = true;
      }
      if (!oldVal || oldVal.selected !== newVal?.selected) {
        const code = newVal?.selected || defaultCode;
        try {
          await router.push(`/${code}`);
        } catch (err) {
          // this might error if the route is already correct
        }
      }
    }
  );
</script>
