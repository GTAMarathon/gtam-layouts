import { Configschema } from '@gtam-layouts/types/schemas';
import parseDuration from 'parse-duration';
import { ExtensionReturn, RunDataTeam, SendMessageArgsMap, RunDataActiveRun, Timer } from '../../../nodecg-speedcontrol/src/types';
import { get } from './util/nodecg';

const nodecg = get();
const timer = nodecg.Replicant<Timer>('timer', 'nodecg-speedcontrol');
const runDataActiveRun = nodecg.Replicant<RunDataActiveRun>('runDataActiveRun', 'nodecg-speedcontrol');
const config = (nodecg.bundleConfig as Configschema).betting;
const speedcontrol = nodecg.extensions['nodecg-speedcontrol'] as unknown as ExtensionReturn;

const predictionEndpoint = '/predictions';
const pollEndpoint = '/polls';

const currentPrediction = nodecg.Replicant<Prediction | undefined>('currentPrediction', { defaultValue: undefined, persistent: true, persistenceInterval: 10000 });
const currentPollX = nodecg.Replicant<Poll | undefined>('currentPoll', { defaultValue: undefined, persistent: true, persistenceInterval: 10000 });

currentPrediction.on('change', (newValue, oldValue) => {
  if (newValue as any == '') {
    currentPrediction.value = undefined;
  }
});
currentPollX.on('change', (newValue, oldValue) => {
  if (newValue as any == '') {
    currentPollX.value = undefined;
  }
});

enum PredictionType {
  SologoalTime,
  DuoWinner,
}
enum PredictionStatus {
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
  RESOLVED = 'RESOLVED',
  CANCELED = 'CANCELED',
}

type Prediction = {
  id: string;
  runId: string;
  type: PredictionType;
  outcome1Id: string;
  outcome2Id: string;
  team1Id: string;
  team2Id?: string;
  goalTime?: number;
  status: PredictionStatus
};
type Poll = {
  id: string;
  runId: string;
};

(async () => {
  if (currentPrediction.value) {
    nodecg.log.info('[PollsAndPredictions] check currentPrediction');
    var status = await getPredictionStatus(currentPrediction.value.id);
    if (!status) {
      currentPrediction.value = undefined;
    } else if (status == PredictionStatus.ACTIVE || status == PredictionStatus.LOCKED) {
      nodecg.log.info('[PollsAndPredictions] currentPrediction checked');
      currentPrediction.value.status = status;
    } else {
      nodecg.log.info('[PollsAndPredictions] currentPrediction is old');
      currentPrediction.value = undefined;
    }
  }

  runDataActiveRun.on('change', async (newVal, oldVal) => {
    try {
      if (config.enable && newVal && (!oldVal || oldVal.id != newVal.id)) {
        nodecg.log.info('[PollsAndPredictions] Run detected');
        if (currentPollX.value && currentPollX.value.runId != newVal.id) {
          await endPoll(currentPollX.value.id);
        }
        if (currentPrediction.value && currentPrediction.value.runId != newVal.id) {
          await cancelPrediction(currentPrediction.value.id);
        }
        if (newVal.customData['betting'] && !currentPollX.value && !currentPrediction.value && newVal.teams.length > 0 && timer.value.state === 'stopped') {
          nodecg.log.info('[PollsAndPredictions] New Bet');
          if (newVal.teams.length == 1) {
            if (newVal.customData['goalTime']) {
              createPrediction(
                newVal.id,
                'Final time for the run?', // 45 characters limit
                'Under ' + newVal.customData['goalTime'],
                newVal.customData['goalTime'] + ' or over',
                1800,
                PredictionType.SologoalTime,
                newVal.teams[0].id,
                undefined,
                parseDuration(newVal.customData['goalTime']));
            }
          } else if (newVal.teams.length == 2) {
            createPrediction(
              newVal.id,
              'Who will win the race?', // 45 characters limit
              getTeamNameForPollOrPrediction(newVal.teams[0]),
              getTeamNameForPollOrPrediction(newVal.teams[1]),
              1800,
              PredictionType.DuoWinner,
              newVal.teams[0].id,
              newVal.teams[1].id,
              undefined);
          } else if (newVal.teams.length < 6) {
            createPoll(
              newVal.id,
              'Who will win the race?', // 60 characters limit
              newVal.teams.map((team) => { return getTeamNameForPollOrPrediction(team) }),
              1800,
            )
          }
        }
      }
    } catch (err) {
      nodecg.log.error('[PollsAndPredictions] error', err);
    }
  });

  timer.on('change', (newVal, oldVal) => {
    if (newVal) {
      if (currentPrediction.value) {
        if (currentPrediction.value.type == PredictionType.SologoalTime && currentPrediction.value.goalTime) {
          if ((newVal.milliseconds >= currentPrediction.value.goalTime)
            || (newVal.state === 'finished' && newVal.teamFinishTimes[currentPrediction.value.team1Id] && newVal.teamFinishTimes[currentPrediction.value.team1Id].state === 'forfeit')) {
            // LOSER
            resolvePrediction(currentPrediction.value.id, currentPrediction.value.outcome2Id);
          }
          else if (newVal.state == 'finished' && newVal.milliseconds < currentPrediction.value.goalTime) {
            // GG
            resolvePrediction(currentPrediction.value.id, currentPrediction.value.outcome1Id);
          }
        } else if (currentPrediction.value.type == PredictionType.DuoWinner && currentPrediction.value.team2Id) {
          if (oldVal && oldVal.state !== 'finished' && newVal.state === 'finished' && newVal.teamFinishTimes[currentPrediction.value.team1Id] && newVal.teamFinishTimes[currentPrediction.value.team2Id]) {

            const team1FinishTimes = newVal.teamFinishTimes[currentPrediction.value.team1Id];
            const team2FinishTimes = newVal.teamFinishTimes[currentPrediction.value.team2Id];
            if ((team1FinishTimes.state === 'forfeit' && team2FinishTimes.state === 'forfeit')
              || (team1FinishTimes.milliseconds == team2FinishTimes.milliseconds)) {
              // Both Losers (or tied) REFUND BETS
              cancelPrediction(currentPrediction.value.id);
            }
            else if (team2FinishTimes.state === 'forfeit') {
              // GG Player 1
              resolvePrediction(currentPrediction.value.id, currentPrediction.value.outcome1Id);
            } else if (team1FinishTimes.state === 'forfeit') {
              // GG Player 2
              resolvePrediction(currentPrediction.value.id, currentPrediction.value.outcome2Id);
            } else if (team2FinishTimes.milliseconds > team1FinishTimes.milliseconds) {
              // GG Player 1
              resolvePrediction(currentPrediction.value.id, currentPrediction.value.outcome1Id);
            } else {
              // GG Player 2
              resolvePrediction(currentPrediction.value.id, currentPrediction.value.outcome2Id);
            }
          }
        }
      }

      if (oldVal && oldVal.state === 'stopped' && newVal.state === 'running') {
        if (currentPollX.value) {
          endPoll(currentPollX.value.id);
        }
        if (currentPrediction.value && currentPrediction.value.status === PredictionStatus.ACTIVE) {
          lockPrediction(currentPrediction.value.id);
        }
      }
    }
  });
})();

function getTeamNameForPollOrPrediction(team: RunDataTeam): string {
  if (team.name) { return team.name }
  else if (team.players.length == 1) { return team.players[0].name }
  else if (team.players.length > 1) { return team.players[0].name + ' et al.' }
  else { return team.id }
}

async function createPoll(runId: string, title: string, choices: string[], duration: number): Promise<void> {
  try {
    var data: SendMessageArgsMap['twitchAPIRequest'] = {
      method: 'post',
      endpoint: pollEndpoint,
      data: {
        broadcaster_id: config.broadcaster_id,
        title: title,
        choices: choices.map((choice) => { return { title: choice } }),
        duration: duration
      },
      newAPI: true,
    }
    var resp = await speedcontrol.sendMessage('twitchAPIRequest', data);
    currentPollX.value = {
      id: resp.body.data[0].id,
      runId: runId,
    };
    nodecg.log.info('[PollsAndPredictions] Poll created');
  } catch (err) {
    nodecg.log.error('[PollsAndPredictions] Failed to create a new Poll', err);
    currentPollX.value = undefined;
  }
}
async function endPoll(id: string): Promise<void> {
  try {
    var data: SendMessageArgsMap['twitchAPIRequest'] = {
      method: 'patch',
      endpoint: pollEndpoint,
      data: {
        broadcaster_id: config.broadcaster_id,
        id: id,
        status: 'TERMINATED',
      },
      newAPI: true,
    }
    await speedcontrol.sendMessage('twitchAPIRequest', data);
    nodecg.log.info('[PollsAndPredictions] Poll ended');
  } catch (err) {
    nodecg.log.error('[PollsAndPredictions] Failed to end Poll', err);
  } finally {
    currentPollX.value = undefined;
  }
}

async function getPredictionStatus(predictionId: string): Promise<PredictionStatus | undefined> {
  nodecg.log.info('[PollsAndPredictions] get the Prediction', predictionId);
  try {
    var endpoint = predictionEndpoint + '?broadcaster_id=' + config.broadcaster_id + '&id=' + predictionId;
    var data: SendMessageArgsMap['twitchAPIRequest'] = {
      method: 'get',
      endpoint: endpoint,
      newAPI: true,
    }
    var resp = await speedcontrol.sendMessage('twitchAPIRequest', data);
    if (resp.body.data && resp.body.data.length == 1 && resp.body.data[0].id == predictionId) {
      nodecg.log.info('[PollsAndPredictions] get the Prediction status', resp.body.data[0]);
      return resp.body.data[0].status as PredictionStatus;
    } else {
      nodecg.log.info('[PollsAndPredictions] Failed to get the Prediction', JSON.stringify(resp));
      throw new Error('Prediciton doesnt exist \n' + JSON.stringify(resp));
    }
  } catch (err) {
    nodecg.log.error('[PollsAndPredictions] Failed to get the Prediction', err);
  }
}
async function createPrediction(runId: string, title: string, outcome1: string, outcome2: string, duration: number, type: PredictionType, team1Id: string, team2Id?: string, goalTime?: number): Promise<void> {
  try {
    var data: SendMessageArgsMap['twitchAPIRequest'] = {
      method: 'post',
      endpoint: predictionEndpoint,
      data: {
        broadcaster_id: config.broadcaster_id,
        title: title,
        outcomes: [{ 'title': outcome1 }, { 'title': outcome2 }],
        prediction_window: duration
      },
      newAPI: true,
    }
    var resp = await speedcontrol.sendMessage('twitchAPIRequest', data);
    currentPrediction.value = {
      id: resp.body.data[0].id,
      runId: runId,
      type: type,
      outcome1Id: resp.body.data[0].outcomes[0].id,
      outcome2Id: resp.body.data[0].outcomes[1].id,
      team1Id: team1Id,
      team2Id: team2Id,
      goalTime: goalTime,
      status: PredictionStatus.ACTIVE,
    }
    nodecg.log.info('[PollsAndPredictions] Prediction created');
  } catch (err) {
    nodecg.log.error('[PollsAndPredictions] Failed to create a new Prediction', err);
    currentPrediction.value = undefined;
  }
}
async function lockPrediction(predictionId: string): Promise<void> {
  try {
    var data: SendMessageArgsMap['twitchAPIRequest'] = {
      method: 'patch',
      endpoint: predictionEndpoint,
      data: {
        broadcaster_id: config.broadcaster_id,
        id: predictionId,
        status: 'LOCKED',
      },
      newAPI: true,
    }
    await speedcontrol.sendMessage('twitchAPIRequest', data);
    if (currentPrediction.value) {
      currentPrediction.value.status = PredictionStatus.LOCKED;
    }
    nodecg.log.info('[PollsAndPredictions] Prediction locked');
  } catch (err) {
    nodecg.log.error('[PollsAndPredictions] Failed to lock the Prediction', err);
    var status = await getPredictionStatus(predictionId);
    if (status === PredictionStatus.LOCKED) {
      if (currentPrediction.value) {
        currentPrediction.value.status = status;
      }
      nodecg.log.info('[PollsAndPredictions] Prediction already locked');
    } else {
      currentPrediction.value = undefined;
    }
  }
}
async function resolvePrediction(predictionId: string, winnerId: string): Promise<void> {
  try {
    var data: SendMessageArgsMap['twitchAPIRequest'] = {
      method: 'patch',
      endpoint: predictionEndpoint,
      data: {
        broadcaster_id: config.broadcaster_id,
        id: predictionId,
        status: 'RESOLVED',
        winning_outcome_id: winnerId,
      },
      newAPI: true,
    }
    await speedcontrol.sendMessage('twitchAPIRequest', data);
    nodecg.log.info('[PollsAndPredictions] Prediction resolved');
  } catch (err) {
    nodecg.log.error('[PollsAndPredictions] Failed to resolve the Prediction', err);
  } finally {
    currentPrediction.value = undefined;
  }
}
async function cancelPrediction(predictionId: string): Promise<void> {
  try {
    var data: SendMessageArgsMap['twitchAPIRequest'] = {
      method: 'patch',
      endpoint: predictionEndpoint,
      data: {
        broadcaster_id: config.broadcaster_id,
        id: predictionId,
        status: 'CANCELED',
      },
      newAPI: true,
    }
    await speedcontrol.sendMessage('twitchAPIRequest', data);
    nodecg.log.info('[PollsAndPredictions] Prediction canceled');

  } catch (err) {
    nodecg.log.error('[PollsAndPredictions] Failed to cancel the Prediction', err);
  } finally {
    currentPrediction.value = undefined;
  }
}