<template >
  <div>
    <div :style="{
      position: 'fixed',
      left: '0px',
      top: '0px'
    }">
      <img v-if="type != 'FINAL RUN' && type != 'END OF MARATHON'" src='./background_2boxes.png'>
      <img v-else-if="type != 'END OF MARATHON'" src='./background_1box.png'>
    </div>

    <div :style="{
      position: 'fixed',
      left: '0px',
      top: '0px'
    }">
      <img v-if="type == 'START OF MARATHON' || type == 'START OF DAY'" src='./background_start.png'>
      <img v-else-if="type == 'END OF DAY'" src='./background_end.png'>
      <img v-else-if="type == 'INTERMISSION' || type == 'FINAL RUN'" src='./background_intermission.png'>
      <img v-else-if="type == 'END OF MARATHON'" src='./background_end_marathon.png'>
    </div>

    <div v-if="type != 'END OF MARATHON'">
      <div :style="{
          position: 'fixed',
          left: '116px',
          top: '320px',
          'padding-left': '20px',
          'font-size': '80px',
          'font-weight': 'normal',
          'font-family': 'Bebas Neue',
        }">
        {{ upNextTimer }}
      </div> 
      <upcoming-run
        :small=false
        :run-data="upNext"
        :style="{
          left: '116px',
          top: '410px',
          height: '234px',
        }">
      </upcoming-run>
      
      <div v-if="type != 'FINAL RUN'">
        <transition name='fade'>
          <div
            :key="onDeckTimer"
            :style="{
              position: 'fixed',
              left: '116px',
              top: '739px',
              'padding-left': '20px',
              'font-size': '60px',
              'font-weight': 'normal',
              'font-family': 'Bebas Neue',
            }">
            {{ onDeckTimer }}
          </div>
        </transition>

        <upcoming-run
          :small=true
          :run-data="onDeck"
          :style="{
            left: '116px',
            top: '809px',
            height: '185px',
          }">
        </upcoming-run>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
  import { Vue, Component, Watch } from 'vue-property-decorator';
  import { State } from 'vuex-class';
  import UpcomingRun from './components/UpcomingRun.vue';
  import { RunData } from 'nodecg/bundles/nodecg-speedcontrol/src/types';
  import { RunDataActiveRunSurrounding, RunDataArray } from 'nodecg/bundles/nodecg-speedcontrol/src/types/schemas';
  import humanizeDuration from 'humanize-duration';
  @Component({
    components: {
      UpcomingRun
    },
  })
  export default class App extends Vue {
    @State runDataArray!: RunDataArray;
    @State runDataActiveRunSurrounding!: RunDataActiveRunSurrounding;

    type: 'START OF MARATHON' | 'INTERMISSION' | 'END OF DAY' | 'START OF DAY' | 'FINAL RUN' | 'END OF MARATHON' | null = null;
    upNext: RunData | null = null;
    upNextTimer = '';
    upNextCountDownCycle?: number;
    onDeckArr: RunData[] = [];
    onDeck: RunData | null = null;
    onDeckTimer = '';
    onDeckIndex = 0;
    onDeckInterval?: number;

    mounted(): void {
      this.update();
      nodecg.listenFor('endOfMarathon', () => {
        this.type = 'END OF MARATHON';
        this.upNext = null;
        this.onDeckArr = [];
      });
      nodecg.listenFor('clearIntermission', () => {
        this.clear();      
      });
    }

    clear(): void {
      this.onDeckArr = [];
      this.upNext = null;
      this.upNextTimer = 'Next run';
      this.onDeckTimer = 'Coming up';
      this.type = null;
    }

    @Watch("runDataActiveRunSurrounding")
    update(): void {
      this.clear();
      var previousRun: RunData | null = null;
      var currentRun: RunData | null = null;
      var nextRun: RunData | null = null;
      if (this.runDataActiveRunSurrounding.previous) {
        var index = this.runDataArray.findIndex(run => run.id === this.runDataActiveRunSurrounding.previous);
        previousRun = this.runDataArray[index];
      }
      if (this.runDataActiveRunSurrounding.current) {
        var index = this.runDataArray.findIndex(run => run.id === this.runDataActiveRunSurrounding.current);
        currentRun = this.runDataArray[index];
      }
      if (this.runDataActiveRunSurrounding.next) {
        var index = this.runDataArray.findIndex(run => run.id === this.runDataActiveRunSurrounding.next);
        nextRun = this.runDataArray[index];
      }

      if (!currentRun) {
        if (nextRun) {
          this.type = 'START OF MARATHON';
          this.upNext = nextRun;
          var index = this.runDataArray.findIndex(run => run.id === nextRun?.id);
          nextRun = this.runDataArray[index+1];
        }
      } else if (!previousRun) {
        this.type = 'START OF MARATHON';
        this.upNext = currentRun;
      } else if (!nextRun) {
        this.type = 'FINAL RUN';
        this.upNext = currentRun;
      } else if (currentRun.gameTwitch == 'Just Chatting') {
        var now = Math.floor(Date.now() / 1000);
        var timerS = nextRun.scheduledS as number - now;
        this.upNext = nextRun;
        this.updateUpNextTimer();
        var index = this.runDataArray.findIndex(run => run.id === nextRun?.id);
        nextRun = this.runDataArray[index+1];
        if(timerS>3600){
          this.type = 'END OF DAY';
        }else{
          this.type = 'START OF DAY';
        }
      } else {
        this.upNext = currentRun;
        if (previousRun.gameTwitch == 'Just Chatting'){
          this.type = 'START OF DAY';
          this.upNextTimer = this.upNextTimer + this.timeToRun(this.upNext);
        } else{
          this.type = 'INTERMISSION';
        }
      }
      while(nextRun && nextRun.gameTwitch == 'Just Chatting'){
          var index = this.runDataArray.findIndex(run => run.id === nextRun?.id);
          nextRun = this.runDataArray[index+1];
      }

      if (nextRun) {
        this.onDeckArr.push(nextRun);
        var index = this.runDataArray.findIndex(run => run.id === nextRun?.id);
        this.onDeckArr = this.onDeckArr.concat(
          this.runDataArray.slice(index + 1, index + 3)
            .filter(run => run.scheduledS && run.gameTwitch === 'Just Chatting' && run.scheduledS < (Math.floor(Date.now() / 1000) + 10800))
        );
      }
    }

    timeToRun(run: RunData): string {
      var value = '';
      if (run.scheduledS) {
        var now = Math.floor(Date.now() / 1000);
        var timerS = run.scheduledS - now;
        if (timerS > 30) {
          var roundedS = this.customizedRounding(timerS);
          value = ' in about ' + humanizeDuration(roundedS * 1000, { conjunction: ' and ', serialComma: false, units: ['d', 'h', 'm'] });
        }
      }
      return value;
    }

    // Update/cycle the 'on deck' run when needed.
    @Watch('upNext', { immediate: true })
    onUpNextChange(): void {
      window.clearInterval(this.upNextCountDownCycle);
      if (this.type =='START OF MARATHON' || this.type =='END OF DAY' || this.type == 'START OF DAY') {
        this.updateUpNextTimer();
        this.upNextCountDownCycle = window.setInterval(this.updateUpNextTimer, 10000);
      }
    }

    updateUpNextTimer(): void {
      if(this.upNext){
        this.upNextTimer = 'Next run' + this.timeToRun(this.upNext);
      }
    }

    @Watch('onDeckArr', { immediate: true })
    onDeckChange(): void {
      window.clearInterval(this.onDeckInterval);
      this.onDeckIndex = 0;
      if (this.onDeckArr.length) {
        this.cycleOnDeck();
        this.onDeckInterval = window.setInterval(this.cycleOnDeck, 10000);
      } else {
        this.onDeck = null;
      }
    }

    cycleOnDeck(): void {
      this.onDeck = this.onDeckArr[this.onDeckIndex];
      this.onDeckTimer = 'Coming up' + this.timeToRun(this.onDeck);
      this.onDeckIndex += 1;
      if (this.onDeckIndex >= this.onDeckArr.length) {
        this.onDeckIndex = 0;
      }
    }

    customizedRounding(time: number): number {
      var rounded: number;
      if (time < 300) {
        rounded = Math.round(time / 60) * 60;
      } else if (time < 3600) {
        rounded = Math.round(time / 300) * 300;
      } else if (time < 7200) {
        var round10 = Math.round(time / 600) * 600;
        var round15 = Math.round(time / 900) * 900;
        rounded = Math.abs(round10 - time) < Math.abs(round15 - time) ? round10 : round15;
      } else if (time < 14400) {
        rounded = Math.round(time / 900) * 900;
      } else if (time < 21600) {
        rounded = Math.round(time / 1800) * 1800;
      } else {
        rounded = Math.round(time / 3600) * 3600;
      }
      return rounded;
    }
  }
</script>

<style>
  @import url('../_misc/common.css');
  @import url('../_misc/Fade.css');
  @import url('../_misc/Flex.css');

  .Flex {
    flex-direction: column;
  }

</style>
