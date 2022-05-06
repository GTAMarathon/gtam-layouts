<template>
  <th class="big" scope="col">
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

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator"; // eslint-disable-line object-curly-newline, max-len
import type { HundoTrackerPlayer } from "@gtam-layouts/types";

@Component
export default class PlayerCompletion extends Vue {
  @Prop() readonly player!: HundoTrackerPlayer;
  @Prop({ default: 1 }) readonly position!: number;

  formatPosition(i: number): string {
    if (i == 1) {
      return "1st";
    } else if (i == 2) {
      return "2nd";
    } else if (i == 3) {
      return "3rd";
    } else {
      return i + "th";
    }
  }
}
</script>
