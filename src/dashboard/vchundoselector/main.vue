<template>
  <v-app>
    <div>
      <div>
        <div v-if="!feedNumber">
          <v-btn
                    :disabled="model.feed1"
            :style="{ 'margin-right': '5px' }"
            v-on:click="select(1)"
          >
            Feed 1
          </v-btn>
          <v-btn
                              :disabled="model.feed2"
            :style="{ 'margin-right': '5px' }"
            v-on:click="select(2)"
          >
            Feed 2
          </v-btn>
          <v-btn
                              :disabled="model.feed3"
            :style="{ 'margin-right': '5px' }"
            v-on:click="select(3)"
          >
            Feed 3
          </v-btn>
          <v-btn
                              :disabled="model.feed4"
            :style="{ 'margin-right': '5px' }"
            v-on:click="select(4)"
          >
            Feed 4
          </v-btn>
          <v-btn
                              :disabled="model.feed5"
            :style="{ 'margin-right': '5px' }"
            v-on:click="select(5)"
          >
            Feed 5
          </v-btn>
        </div>
        <div v-else>
          <v-btn color="accent" disabled>
            Feed {{ feedNumber }}
          </v-btn>
        </div>
      </div>
      <div v-if="feedNumber">
        <v-btn
          v-for="runner in runners"
          :key="runner.id"
          @click="assign(runner)"
          color="primary"
          :style="{
            'margin-top': '5px',
            'margin-right': '5px',
          }"
        >
          {{ runner.players[0].name }}
        </v-btn>
      </div>

      <div>
        <v-btn
          :disabled="disableSend"
          :style="{             'margin-top': '5px',          'margin-right': '5px', }"
          v-on:click="send()"
        >
          SEND
        </v-btn>
        <v-btn
          :disabled="feedNumber"
          :style="{             'margin-top': '5px',          'margin-right': '5px', }"
          v-on:click="cancel()"
        >
          CANCEL
        </v-btn>
      </div>

    </div>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { State } from "vuex-class";
import {  RunDataActiveRun } from "nodecg/bundles/nodecg-speedcontrol/src/types/schemas";
import { RunDataTeam } from "../../../../nodecg-speedcontrol/src/types";

@Component
export default class App extends Vue {
  @State runDataActiveRun!: RunDataActiveRun;
  model : {
    feedNumber: number | undefined,
    feed1: RunDataTeam | undefined,
    feed2: RunDataTeam | undefined,
    feed3: RunDataTeam | undefined,
    feed4: RunDataTeam | undefined,
    feed5: RunDataTeam | undefined,
  } = {
    feedNumber : undefined,
    feed1: undefined,
    feed2: undefined,
    feed3: undefined,
    feed4: undefined,
    feed5: undefined,
  };

  get runners(): RunDataTeam[] {
    return this.runDataActiveRun.teams.filter(team => team!=this.model.feed1 && team!=this.model.feed2 && team!=this.model.feed3 && team!=this.model.feed4 && team!=this.model.feed5);
  }
  get feedNumber(): number | undefined {
    return this.model.feedNumber;
  }
  get disableSend(): boolean{
    return this.feedNumber != undefined || this.model.feed1==undefined|| this.model.feed2==undefined|| this.model.feed3==undefined|| this.model.feed4==undefined|| this.model.feed5==undefined;
  }

  select(feedNumber: number): void {
    this.$set(this.model, "feedNumber", feedNumber);
  }

  assign(team: RunDataTeam): void {
    switch (this.model.feedNumber) {
      case 1:
        this.$set(this.model, "feed1", team);
        break;
      case 2:
        this.$set(this.model, "feed2", team);
        break;
      case 3:
        this.$set(this.model, "feed3", team);
        break;
      case 4:
        this.$set(this.model, "feed4", team);
        break;
      case 5:
        this.$set(this.model, "feed5", team);
        break;
      default:
    }

    this.$set(this.model, "feedNumber", undefined);
  }

  send():void{
    var data = {
      feed1: this.model.feed1,
      feed2: this.model.feed2,
      feed3: this.model.feed3,
      feed4: this.model.feed4,
      feed5: this.model.feed5,
    };
    nodecg
      .sendMessage("changeRunnersOnVCHundo", data)
      .then(() => {})
      .catch(() => {});

    this.$set(this.model, "feed1", undefined);
    this.$set(this.model, "feed2", undefined);
    this.$set(this.model, "feed3", undefined);
    this.$set(this.model, "feed4", undefined);
    this.$set(this.model, "feed5", undefined);
    this.$set(this.model, "selectedRunner", undefined);
  }
  
  cancel():void{
    this.$set(this.model, "feed1", undefined);
    this.$set(this.model, "feed2", undefined);
    this.$set(this.model, "feed3", undefined);
    this.$set(this.model, "feed4", undefined);
    this.$set(this.model, "feed5", undefined);
    this.$set(this.model, "selectedRunner", undefined);
  }
}
</script>