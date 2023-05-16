<template>
  <div>
    <div v-if="enableChange">
      <div>
        <div v-if="!selectedRunner">
          <QBtn
            v-for="runner in runners"
            :key="runner.id"
            :style="{ 'margin-right': '5px' }"
            v-on:click="select(runner)"
            color="black"
          >
            {{ runner.name }}
          </QBtn>
        </div>
        <div v-else>
          <QBtn color="accent" disabled>
            {{ selectedRunner.name }}
          </QBtn>
        </div>
      </div>
      <div v-if="selectedRunner">
        <QBtn
          v-for="stream in streams"
          :key="stream.name"
          @click="assign(stream)"
          color="primary"
          :style="{
            'margin-top': '5px',
            'margin-right': '5px',
          }"
          size="14px"
        >
          {{ stream.name }}
          <br />
          ({{ stream.twitchAccount }})
        </QBtn>
        <QBtn
          v-on:click="select(undefined)"
          color="secondary"
          :style="{
            'margin-top': '5px',
            'margin-right': '5px',
          }"
        >
          CANCEL
        </QBtn>
      </div>
    </div>
    <QBanner v-else class="bg-primary text-white">
      Cannot change runners' feeds while the timer is running
    </QBanner>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, Ref } from 'vue';
  import { useReplicant } from 'nodecg-vue-composable';
  import {
    RunDataActiveRun,
    Timer,
  } from 'nodecg/bundles/nodecg-speedcontrol/src/types/schemas';
  import { useHead } from '@vueuse/head';

  interface Player {
    name: string;
    id: string;
    teamID: string;
    country?: string;
    pronouns?: string;
    social: {
      twitch?: string;
    };
  }

  interface Stream {
    name: string;
    twitchAccount: string;
  }

  type Mutable<Type> = {
    -readonly [Key in keyof Type]: Type[Key];
  };

  interface Model {
    selectedRunner: Player | undefined;
  }

  export default defineComponent({
    setup() {
      useHead({ title: 'Assign streams to players' });

      const runDataActiveRun = useReplicant<RunDataActiveRun>(
        'runDataActiveRun',
        'nodecg-speedcontrol'
      );

      const timer = useReplicant<Timer>('timer', 'nodecg-speedcontrol');

      const streams: Mutable<Stream[]> = nodecg.bundleConfig.feeds
        .streams as Mutable<Stream[]>;

      let model: Ref<Model> = ref({
        selectedRunner: undefined,
      });

      const enableChange = computed<boolean>((): boolean => {
        return !['running', 'paused'].includes(timer!.data!.state);
      });

      const runners = computed<Player[]>((): Player[] => {
        var players = [];
        if (runDataActiveRun!.data && runDataActiveRun!.data.teams) {
          for (var team of runDataActiveRun!.data.teams) {
            for (var player of team.players) {
              players.push(player);
            }
          }
        }
        return players;
      });

      const selectedRunner = computed<Player | undefined>(
        (): Player | undefined => {
          return model.value.selectedRunner;
        }
      );

      function select(runner: Player | undefined): void {
        model.value.selectedRunner = runner;
      }

      function assign(stream: Stream): void {
        var data = {
          runner: selectedRunner.value,
          stream: stream,
        };
        nodecg
          .sendMessage('assignStreamToRunner', data)
          .then(() => {})
          .catch(() => {});

        model.value.selectedRunner = undefined;
      }

      return {
        streams,
        runDataActiveRun,
        timer,
        model,
        enableChange,
        runners,
        selectedRunner,
        select,
        assign,
      };
    },
  });
</script>
