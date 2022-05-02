import { Configschema } from '../types/schemas/configschema';
import { ExtensionReturn, RunData, Timer } from '../../../nodecg-speedcontrol/src/types';
import { get } from './util/nodecg';
import obs from './util/obs';

const nodecg = get();
const { sendMessage } = nodecg.extensions['nodecg-speedcontrol'] as unknown as ExtensionReturn;
const timer = nodecg.Replicant<Timer>('timer', 'nodecg-speedcontrol');
const runDataActiveRun = nodecg.Replicant<RunData>('runDataActiveRun', 'nodecg-speedcontrol');
const config = (nodecg.bundleConfig as Configschema);

timer.on('change', (newVal, oldVal) => {
  if (oldVal && oldVal.state !== 'finished' && newVal.state === 'finished') {
    nodecg.sendMessage('clearIntermission');
  }
});
nodecg.listenFor('endOfMarathonnextRun', async (data, ack) => {
  obs.changeToIntermission().catch(() => { });
    if (ack && !ack.handled) {
    ack(null);
  }
});

nodecg.listenFor('nextRun', async (data, ack) => {
  nodecg.sendMessage('clearIntermission');

  sendMessage('twitchStartCommercial', { duration: 180 })
    .then(() => {
      nodecg.log.info('played ads');
    })
    .catch((err: any) => {
      nodecg.log.warn('Cannot play ads: ', err);
    });
  obs.changeToIntermission().catch(() => { });
  setTimeout(() => sendMessage('changeToNextRun').catch(() => { }), 1000);
  obs.muteAudio();
  obs.unmuteAudio();
  if (ack && !ack.handled) {
    ack(null);
  }
});

nodecg.listenFor('focusOnRunner', (data, ack) => {
  obs.focusOnRunnerX(data).catch(() => { });

  if (ack && !ack.handled) {
    ack(null);
  }
});

nodecg.listenFor('assignStreamToRunner', (data, ack) => {
  var source43: string | undefined;
  var source169: string | undefined;

  if (data.runner && data.stream.twitchAccount && data.stream && runDataActiveRun.value && runDataActiveRun.value.teams) {
    var players = [];
    for (var team of runDataActiveRun.value.teams) {
      for (var player of team.players) {
        players.push(player);
      }
    }

    var index = players.findIndex(playerX => playerX.id == data.runner.id);

    switch (index) {
      case 0:
        source43 = config.obs.names.sources.runner1_43;
        source169 = config.obs.names.sources.runner1_169;
        break;
      case 1:
        source43 = config.obs.names.sources.runner2_43;
        source169 = config.obs.names.sources.runner2_169;
        break;
      case 2:
        source43 = config.obs.names.sources.runner3_43;
        source169 = config.obs.names.sources.runner3_169;
        break;
      case 3:
        source43 = config.obs.names.sources.runner4_43;
        source169 = config.obs.names.sources.runner4_169;
        break;
      default:
        nodecg.log.warn('cannot assign stream to runner: ', data.runner);
        nodecg.log.warn('index: ', index);
        nodecg.log.warn('players: ', players);
        break;
    }
    if (source43 && source169) {
      var url = config.feeds.playerUrl.replace(new RegExp('{{twitchAccount}}', 'g'), data.stream.twitchAccount);
      obs.setUrlToSources(url, [source43, source169]).catch(() => { });
    }

    if (ack && !ack.handled) {
      ack(null);
    }
  }
});