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
      ></v-text-field>
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
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';

@Component
export default class App extends Vue {
  name = '';
  saved = false;
  @State host!: string;
  @Mutation('updateHost') updateHostMutation!: (value: string) => void;

  @Watch('host', { immediate: true })
  onHostChange(val: string): void {
    this.name = val;
  }

  updateHost(): void {
    this.updateHostMutation(this.name);
    this.saved = true;
    setTimeout(() => { this.saved = false; }, 1000);
  }
}
</script>
