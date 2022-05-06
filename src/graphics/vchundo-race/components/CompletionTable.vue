<template>
  <div :style="{ position: 'fixed' }">
    <table class="table table-bordered">
      <player-completion
        v-for="(player, i) in hundoTrackerData"
        :player="player"
        :position="i + 1"
        :key="player.name"
      />
    </table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch } from "vue-property-decorator"; // eslint-disable-line object-curly-newline, max-len
import { State } from "vuex-class";
import type { HundoTrackerData } from "@gtam-layouts/types/schemas";
import PlayerCompletion from "./CompletionTable/PlayerCompletion.vue";

@Component({
  components: {
    PlayerCompletion,
  },
})
export default class CompletionTable extends Vue {
  @State hundoTrackerData!: HundoTrackerData;
}
</script>
>
