import { Configschema } from '@gtam-layouts/types/schemas';
import { ExtensionReturn } from '../../../nodecg-speedcontrol/src/types';
import { get } from './util/nodecg';
import obs from './util/obs';
import { updateOengusScheduleOnSwitchingRun } from './scheduling';
import {
  timer as timerRep,
  runDataActiveRun as activeRun,
  gameLayouts,
} from './util/replicants';

const nodecg = get();
const { sendMessage } = nodecg.extensions[
  'nodecg-speedcontrol'
] as unknown as ExtensionReturn;
const config = nodecg.bundleConfig as Configschema;
const defaultCode = '4x3-1p';

timerRep.on('change', (newVal, oldVal) => {
  if (oldVal && oldVal.state !== 'finished' && newVal.state === 'finished') {
    nodecg.sendMessage('clearIntermission');
  }
});

activeRun.on('change', (newVal) => {
  if (newVal) {
    if (newVal.customData.gameLayout) {
      gameLayouts.value.selected = newVal.customData.gameLayout;
    } else {
      gameLayouts.value.selected = defaultCode;
    }
  }
});

gameLayouts.on('change', (newVal, oldVal) => {
  // Don't do anything if OBS integration is disabled or not connected
  if (!config.obs.enable || !obs.connected) return;

  if (newVal.selected && oldVal?.selected) {
    // if the selected layout didn't change, don't update
    if (newVal.selected != oldVal?.selected) {
      obs.setGameLayout(newVal.selected || defaultCode);
    }
  } else {
    // if no previous value, change it to new one or use the default one
    obs.setGameLayout(newVal.selected || defaultCode);
  }
});

nodecg.listenFor('endOfMarathon', async (data, ack) => {
  obs.changeToIntermission().catch(() => {});
  if (ack && !ack.handled) {
    ack(null);
  }
});

nodecg.listenFor('nextRun', async (data, ack) => {
  await sendMessage('importOengusSchedule', {
    marathonShort: config.schedule.marathonShort,
    useJapanese: false,
  }).catch(() => {});
  nodecg.sendMessage('clearIntermission');
  await new Promise((f) => setTimeout(f, 60));

  sendMessage('twitchStartCommercial', { duration: 180 })
    .then(() => {
      nodecg.log.info('played ads');
    })
    .catch((err: any) => {
      nodecg.log.warn('Cannot play ads: ', err);
    });
  obs.changeToIntermission().catch(() => {});
  setTimeout(() => sendMessage('changeToNextRun').catch(() => {}), 1000);
  obs.muteAudio();
  obs.unmuteAudio();

  await updateOengusScheduleOnSwitchingRun();

  if (ack && !ack.handled) {
    ack(null);
  }
});

nodecg.listenFor('focusOnRunner', (data, ack) => {
  obs.focusOnRunnerX(data).catch(() => {});

  if (ack && !ack.handled) {
    ack(null);
  }
});

nodecg.listenFor('changeRunnersOnVCHundo', (data, ack) => {
  obs.changeRunnersOnVCHundo(data).catch(() => {});

  if (ack && !ack.handled) {
    ack(null);
  }
});

nodecg.listenFor('assignStreamToRunner', (data, ack) => {
  var source: string | undefined;

  if (
    data.runner &&
    data.stream.twitchAccount &&
    data.stream &&
    activeRun.value &&
    activeRun.value.teams
  ) {
    var players = [];
    for (var team of activeRun.value.teams) {
      for (var player of team.players) {
        players.push(player);
      }
    }

    var index = players.findIndex((playerX) => playerX.id == data.runner.id);

    switch (index) {
      case 0:
        source = config.obs.names.sources.runner1;
        break;
      case 1:
        source = config.obs.names.sources.runner2;
        break;
      case 2:
        source = config.obs.names.sources.runner3;
        break;
      case 3:
        source = config.obs.names.sources.runner4;
        break;
      default:
        nodecg.log.warn('cannot assign stream to runner: ', data.runner);
        nodecg.log.warn('index: ', index);
        nodecg.log.warn('players: ', players);
        break;
    }
    obs
      .setTwitchUrlToSources(data.stream.twitchAccount, [source])
      .catch(() => {});

    if (ack && !ack.handled) {
      ack(null);
    }
  }
});
