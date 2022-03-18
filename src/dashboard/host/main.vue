<template>
  <v-app>
    <div class="d-flex">
      <v-text-field
        v-model="name"
        label="Host"
        hide-details
        filled
        :spellcheck="false"
        @keyup.enter="updateHost"
      />
      <v-btn
        height="56px"
        :style="{ 'min-width': '0', 'margin-left': '5px' }"
        :loading="saved"
        :disabled="saved"
        @click="updateHost"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </div>
  </v-app>
</template>

<script lang="ts">
import { replicantModule, replicantNS } from '@gtam-layouts/browser_shared/replicant_store';
import { Host } from '@gtam-layouts/types/schemas';
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component
export default class App extends Vue {
  name = '';
  saved = false;
  @replicantNS.State((s) => s.reps.host) readonly host!: Host;

  @Watch('host', { immediate: true })
  onHostChange(val: string): void {
    this.name = val;
  }

  updateHost(): void {
    replicantModule.setReplicant<Host>({ name: 'host', val: this.name });
    this.saved = true;
    setTimeout(() => { this.saved = false; }, 1000);
  }
}
</script>
