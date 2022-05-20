<template>
  <v-app>
    <div>
      <div :key="numberOfFeeds">
        Number of Feeds {{numberOfFeeds}}
        <div v-if="!numberOfFeeds">
          <v-btn
            :style="{ 'margin-right': '5px' }"
            v-on:click="selectNumberOfFeeds(1)"
          >
            1 Feed
          </v-btn>
          <v-btn
            :style="{ 'margin-right': '5px' }"
            v-on:click="selectNumberOfFeeds(2)"
          >
            2 Feeds
          </v-btn>
          <v-btn
            :style="{ 'margin-right': '5px' }"
            v-on:click="selectNumberOfFeeds(3)"
          >
            3 Feeds
          </v-btn>
          <v-btn
            :style="{ 'margin-right': '5px' }"
            v-on:click="selectNumberOfFeeds(4)"
          >
            4 Feeds
          </v-btn>
          <v-btn
            :style="{ 'margin-right': '5px' }"
            v-on:click="selectNumberOfFeeds(5)"
          >
            5 Feeds
          </v-btn>
        </div>
      </div>
      <div v-if="numberOfFeeds">
        <div v-if="!feedNumber">
          <v-btn
            v-if="numberOfFeeds>0"
            :disabled="model.feed1"
            :style="{ 'margin-right': '5px' }"
            v-on:click="feedToSelect(1)"
          >
            Feed 1
          </v-btn>
          <v-btn
            v-if="numberOfFeeds>1"
            :disabled="model.feed2"
            :style="{ 'margin-right': '5px' }"
            v-on:click="feedToSelect(2)"
          >
            Feed 2
          </v-btn>
          <v-btn
            v-if="numberOfFeeds>2"
            :disabled="model.feed3"
            :style="{ 'margin-right': '5px' }"
            v-on:click="feedToSelect(3)"
          >
            Feed 3
          </v-btn>
          <v-btn
            v-if="numberOfFeeds>3"
            :disabled="model.feed4"
            :style="{ 'margin-right': '5px' }"
            v-on:click="feedToSelect(4)"
          >
            Feed 4
          </v-btn>
          <v-btn
            v-if="numberOfFeeds>4"
            :disabled="model.feed5"
            :style="{ 'margin-right': '5px' }"
            v-on:click="feedToSelect(5)"
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
          :style="{ 'margin-top': '5px', 'margin-right': '5px', }"
          v-on:click="send()"
        >
          SEND
        </v-btn>
        <v-btn
          :disabled="feedNumber"
          :style="{ 'margin-top': '5px', 'margin-right': '5px', }"
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
import { RunDataActiveRun } from "nodecg/bundles/nodecg-speedcontrol/src/types/schemas";
import { RunDataTeam } from "nodecg/bundles/nodecg-speedcontrol/src/types";

@Component
export default class App extends Vue {
  @State runDataActiveRun!: RunDataActiveRun;
  model : {
    numberOfFeeds: number | undefined,
    feedNumber: number | undefined,
    feed1: RunDataTeam | undefined,
    feed2: RunDataTeam | undefined,
    feed3: RunDataTeam | undefined,
    feed4: RunDataTeam | undefined,
    feed5: RunDataTeam | undefined,
  } = {
    numberOfFeeds : undefined,
    feedNumber : undefined,
    feed1: undefined,
    feed2: undefined,
    feed3: undefined,
    feed4: undefined,
    feed5: undefined,
  };

  get runners(): RunDataTeam[] {
    return this.runDataActiveRun.teams.filter(team =>
      team!=this.model.feed1 &&
      team!=this.model.feed2 &&
      team!=this.model.feed3 &&
      team!=this.model.feed4 &&
      team!=this.model.feed5
    );
  }
  get feedNumber(): number | undefined {
    return this.model.feedNumber;
  }
  get numberOfFeeds(): number | undefined {
    return this.model.numberOfFeeds;
  }
  get disableSend(): boolean{
    return this.model.numberOfFeeds == undefined ||
      this.model.feedNumber != undefined ||
      this.model.feed1==undefined ||
      (this.model.numberOfFeeds>1 && this.model.feed2==undefined) ||
      (this.model.numberOfFeeds>2 && this.model.feed3==undefined) ||
      (this.model.numberOfFeeds>3 && this.model.feed4==undefined) ||
      (this.model.numberOfFeeds>4 && this.model.feed5==undefined);
  }

  feedToSelect(feedNumber: number): void {
    this.$set(this.model, "feedNumber", feedNumber);
  }
  selectNumberOfFeeds(num: number): void {
    this.$set(this.model, "numberOfFeeds", num);
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
    var feeds = [];
    if(this.model.feed1){
      feeds.push(this.model.feed1);
    }
    if(this.model.feed2){
      feeds.push(this.model.feed2);
    }
    if(this.model.feed3){
      feeds.push(this.model.feed3);
    }
    if(this.model.feed4){
      feeds.push(this.model.feed4);
    }
    if(this.model.feed5){
      feeds.push(this.model.feed5);
    }
    if(feeds.length == this.model.numberOfFeeds){
    var data = {
      numberOfFeeds: this.model.numberOfFeeds,
      feeds: feeds,
    };
    nodecg
      .sendMessage("changeRunnersFeedOnScreenWithScore", data)
      .then(() => {})
      .catch(() => {});
    }

    this.cancel();
  }
  
  cancel():void{
    this.$set(this.model, "feed1", undefined);
    this.$set(this.model, "feed2", undefined);
    this.$set(this.model, "feed3", undefined);
    this.$set(this.model, "feed4", undefined);
    this.$set(this.model, "feed5", undefined);
    this.$set(this.model, "selectedRunner", undefined);
    this.$set(this.model, "numberOfFeeds", undefined);

  }
}
</script>