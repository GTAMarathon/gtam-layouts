<template>
  <div
    :style="{ position: 'fixed', }">
    <transition name="fade">
      <div
        v-if="!runData"
        class="Flex"
        :style="{ 'font-size': '3em' }"
      >
      </div>
      <div
        v-else
        :key="runData.id"
        class="Flex"
        :style="{
          'padding-left': '20px',
          'padding-right': '20px',
          'font-size': small ? smallFontSize+'px' : bigFontSize+'px',
          'width': small ? smallWidth+'px' : bigWidth+'px',
        }">
        <div
          :style="{
            'flex-direction': 'column',
            'text-align': 'left',
            'align-items': 'normal',
        }">
          <div
            ref="game"
            :style="{
              'font-size': '1em',
              'width': small ? smallWidth+'px' : bigWidth+'px',
            }"
          >
         {{ runData.game }}
          </div>
          <div
            ref="category"
            :style="{
              'font-size': catRatio+'em',
              'width': small ? smallWidth+'px' : bigWidth+'px',
            }"
            >
            {{ runData.category }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop , Ref, Watch } from 'vue-property-decorator';
import { RunData } from 'nodecg/bundles/nodecg-speedcontrol/src/types';
import fitty, { FittyInstance } from "fitty";

@Component
export default class UpcomingRun extends Vue {
  @Prop(Object) readonly runData!: RunData | null;
  @Prop({ default: false }) readonly small!: boolean | null;
  @Ref("game") game!: HTMLDivElement;
  @Ref("category") category!: HTMLDivElement;
  gameFitty: FittyInstance | undefined;
  categoryFitty: FittyInstance | undefined;
  smallFontSize = 60;
  bigFontSize = 80;
  smallWidth = 944;
  bigWidth = 1284;
  catRatio = 0.75;
  minSizeRatio = 0.4;

  fit(): void {
    if(this.game){
      this.gameFitty = fitty(this.game, {
        maxSize: this.small? this.smallFontSize : this.bigFontSize ,
        minSize: this.small? this.smallFontSize*this.minSizeRatio : this.bigFontSize*this.minSizeRatio,
        multiLine: true
      });
    }
    if(this.category){
      this.categoryFitty = fitty(this.category, {
        maxSize: this.small? this.smallFontSize*this.catRatio : this.bigFontSize*this.catRatio,
        minSize: this.small? this.smallFontSize*this.minSizeRatio*this.catRatio : this.bigFontSize*this.minSizeRatio*this.catRatio,
        multiLine: true
      });
    }
  }

  mounted(): void {
    setTimeout(() => {
      this.fit();
    }, 500);
  }

  @Watch("runData")
  onRunChange(val: RunData | null): void {
    setTimeout(() => {
      this.fit();
    }, 500);
  }

}

</script>

<style scoped>
  .Flex {
    flex-direction: column;
    text-align: left;
    align-items: normal;
  }
</style>
