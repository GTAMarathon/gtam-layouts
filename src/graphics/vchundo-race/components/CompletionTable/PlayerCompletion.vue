<template>
  <th v-if="player" class="big" scope="col">
    <div class="table_pos">
      <b>{{ formatPosition(position) }}</b>
    </div>
    <br />
    <div class="table_name">
      {{ player.name }}
    </div>
    <br />
    <div class="table_score">
      <b>{{ player.score }}%</b>
    </div>
  </th>
</template>

<script setup lang="ts">
  import type { HundoTrackerPlayer } from '@gtam-layouts/types';

  interface Props {
    player: HundoTrackerPlayer | null;
    position: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    player: null,
    position: 1,
  });

  function formatPosition(i: number): string {
    if (i == 1) {
      return '1st';
    } else if (i == 2) {
      return '2nd';
    } else if (i == 3) {
      return '3rd';
    } else {
      return i + 'th';
    }
  }
</script>
