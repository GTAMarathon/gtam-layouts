<template>
  <div>
    <div>
      <div>
        <div v-if="!feedNumber">
          <QBtn
            :disabled="model.feed1 != undefined"
            :style="{ 'margin-right': '5px' }"
            v-on:click="select(1)"
            color="black"
          >
            Feed 1
          </QBtn>
          <QBtn
            :disabled="model.feed2 != undefined"
            :style="{ 'margin-right': '5px' }"
            v-on:click="select(2)"
            color="black"
          >
            Feed 2
          </QBtn>
          <QBtn
            :disabled="model.feed3 != undefined"
            :style="{ 'margin-right': '5px' }"
            v-on:click="select(3)"
            color="black"
          >
            Feed 3
          </QBtn>
          <QBtn
            :disabled="model.feed4 != undefined"
            :style="{ 'margin-right': '5px' }"
            v-on:click="select(4)"
            color="black"
          >
            Feed 4
          </QBtn>
          <QBtn
            :disabled="model.feed5 != undefined"
            :style="{ 'margin-right': '5px' }"
            v-on:click="select(5)"
            color="black"
          >
            Feed 5
          </QBtn>
        </div>
        <div v-else>
          <QBtn color="accent" disabled> Feed {{ feedNumber }} </QBtn>
        </div>
      </div>
      <div v-if="feedNumber">
        <QBtn
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
        </QBtn>
      </div>

      <div>
        <QBtn
          :disabled="disableSend"
          :style="{ 'margin-top': '5px', 'margin-right': '5px' }"
          v-on:click="send()"
          color="primary"
        >
          SEND
        </QBtn>
        <QBtn
          :disabled="feedNumber != undefined"
          :style="{ 'margin-top': '5px', 'margin-right': '5px' }"
          v-on:click="cancel()"
          color="red"
        >
          CANCEL
        </QBtn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, Ref } from 'vue';
  import { useReplicant } from 'nodecg-vue-composable';
  import { RunDataActiveRun } from 'speedcontrol/types/schemas';
  import { RunDataTeam } from 'speedcontrol/types';
  import { useHead } from '@vueuse/head';

  interface Model {
    feedNumber: number | undefined;
    feed1: RunDataTeam | undefined;
    feed2: RunDataTeam | undefined;
    feed3: RunDataTeam | undefined;
    feed4: RunDataTeam | undefined;
    feed5: RunDataTeam | undefined;
  }

  export default defineComponent({
    setup() {
      useHead({ title: 'Assign streams to players (VC Hundo version)' });

      const runDataActiveRun = useReplicant<RunDataActiveRun>(
        'runDataActiveRun',
        'nodecg-speedcontrol'
      );

      let model: Ref<Model> = ref({
        feedNumber: undefined,
        feed1: undefined,
        feed2: undefined,
        feed3: undefined,
        feed4: undefined,
        feed5: undefined,
      });

      const runners = computed<RunDataTeam[]>((): RunDataTeam[] => {
        return runDataActiveRun!.data!.teams.filter(
          (team) =>
            team != model.value.feed1 &&
            team != model.value.feed2 &&
            team != model.value.feed3 &&
            team != model.value.feed4 &&
            team != model.value.feed5
        );
      });

      const feedNumber = computed<number | undefined>(
        (): number | undefined => {
          return model.value.feedNumber;
        }
      );

      const disableSend = computed<boolean>((): boolean => {
        return (
          feedNumber.value != undefined ||
          model.value.feed1 == undefined ||
          model.value.feed2 == undefined ||
          model.value.feed3 == undefined ||
          model.value.feed4 == undefined ||
          model.value.feed5 == undefined
        );
      });

      function select(feedNumber: number): void {
        model.value.feedNumber = feedNumber;
      }

      function assign(team: RunDataTeam): void {
        switch (model.value.feedNumber) {
          case 1:
            model.value.feed1 = team;
            break;
          case 2:
            model.value.feed2 = team;
            break;

          case 3:
            model.value.feed3 = team;
            break;
          case 4:
            model.value.feed4 = team;
            break;
          case 5:
            model.value.feed5 = team;
            break;
        }
        model.value.feedNumber = undefined;
      }

      function send(): void {
        var data = {
          feed1: model.value.feed1,
          feed2: model.value.feed2,
          feed3: model.value.feed3,
          feed4: model.value.feed4,
          feed5: model.value.feed5,
        };
        nodecg
          .sendMessage('changeRunnersOnVCHundo', data)
          .then(() => {})
          .catch(() => {});

        model.value.feed1 = undefined;
        model.value.feed2 = undefined;
        model.value.feed3 = undefined;
        model.value.feed4 = undefined;
        model.value.feed5 = undefined;
        model.value.feedNumber = undefined;
      }

      function cancel(): void {
        model.value.feed1 = undefined;
        model.value.feed2 = undefined;
        model.value.feed3 = undefined;
        model.value.feed4 = undefined;
        model.value.feed5 = undefined;
        model.value.feedNumber = undefined;
      }

      return {
        runDataActiveRun,
        model,
        runners,
        feedNumber,
        disableSend,
        select,
        assign,
        send,
        cancel,
      };
    },
  });
</script>
