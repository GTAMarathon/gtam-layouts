import { Configschema } from '@gtam-layouts/types/schemas';
import parseDuration from 'parse-duration';
import { ExtensionReturn, RunDataTeam, SendMessageArgsMap, RunDataActiveRun, Timer } from '../../../nodecg-speedcontrol/src/types';
import { get } from './util/nodecg';
import needle, { NeedleResponse } from 'needle';

const nodecg = get();
const timer = nodecg.Replicant<Timer>('timer', 'nodecg-speedcontrol');
const runDataActiveRun = nodecg.Replicant<RunDataActiveRun>('runDataActiveRun', 'nodecg-speedcontrol');
const config = (nodecg.bundleConfig as Configschema).betting;
const speedcontrol = nodecg.extensions['nodecg-speedcontrol'] as unknown as ExtensionReturn;

const predictionEndpoint = '/predictions';
const pollEndpoint = '/polls';

const currentPrediction = nodecg.Replicant<Prediction | undefined>('currentPrediction', { defaultValue: undefined, persistent: true, persistenceInterval: 10000 });
const currentPoll = nodecg.Replicant<Poll | undefined>('currentPoll', { defaultValue: undefined, persistent: true, persistenceInterval: 10000 });

const config2 = (nodecg.bundleConfig as Configschema).highlight;

currentPrediction.on('change', (newValue, oldValue) => {
  if (newValue as any == '') {
    currentPrediction.value = undefined;
  }
});
currentPoll.on('change', (newValue, oldValue) => {
  if (newValue as any == '') {
    currentPoll.value = undefined;
  }
});

enum PredictionType {
  GoalTime,
  Winner,
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
  outcomes: { id: string, teamId: string }[]
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
        await new Promise(f => setTimeout(f, 5000)); // wait 5s to make sure the timer has been reset
        if (currentPoll.value && currentPoll.value.runId != newVal.id) {
          await endPoll(currentPoll.value.id);
        }
        if (currentPrediction.value && currentPrediction.value.runId != newVal.id) {
          await cancelPrediction(currentPrediction.value.id);
        }
        if (newVal.customData['betting'] && !currentPoll.value && !currentPrediction.value && newVal.teams.length > 0 && timer.value.state === 'stopped') {
          nodecg.log.info('[PollsAndPredictions] New Bet');
          if (newVal.teams.length == 1) {
            if (newVal.customData['goalTime']) {
              createPredictionGoalTime(
                newVal.id,
                'Final time for the run?', // 45 characters limit
                newVal.customData['goalTime'],
                1800,
                newVal.teams[0].id,
              );
            }
          } else if (newVal.teams.length < 11) {
            createPredictionWinner(
              newVal.id,
              'Who will win the race?', // 45 characters limit
              newVal.teams,
              1800,
            );
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
        if (currentPrediction.value.type == PredictionType.GoalTime && currentPrediction.value.goalTime) {
          if ((newVal.milliseconds >= currentPrediction.value.goalTime)
            || (newVal.state === 'finished' && newVal.teamFinishTimes[currentPrediction.value.outcomes[0].teamId] && newVal.teamFinishTimes[currentPrediction.value.outcomes[0].teamId].state === 'forfeit')) {
            // LOSER
            resolvePrediction(currentPrediction.value.id, currentPrediction.value.outcomes[1].id);
          }
          else if (newVal.state == 'finished' && newVal.milliseconds < currentPrediction.value.goalTime) {
            // GG
            resolvePrediction(currentPrediction.value.id, currentPrediction.value.outcomes[0].id);
          }
        } else if (currentPrediction.value.type == PredictionType.Winner) {
          if (oldVal && oldVal.state !== 'finished' && newVal.state === 'finished') {

            var teamFinishTimes = currentPrediction.value.outcomes.map(outcome => { return newVal.teamFinishTimes[outcome.teamId] });
            teamFinishTimes = teamFinishTimes.filter(teamFinishTime => teamFinishTime && teamFinishTime.state === 'completed');
            teamFinishTimes.sort((a, b) => a.milliseconds - b.milliseconds);
            if (teamFinishTimes.length < 2 || teamFinishTimes[0].milliseconds == teamFinishTimes[1].milliseconds) {
              cancelPrediction(currentPrediction.value.id);
            } else {
              var teamId = Object.keys(newVal.teamFinishTimes).find(key => newVal.teamFinishTimes[key] === teamFinishTimes[0]);
              var winningOutcome = currentPrediction.value.outcomes.filter(outcome => outcome.teamId == teamId);
              if (winningOutcome.length > 0) {
                resolvePrediction(currentPrediction.value.id, winningOutcome[0].id);
              } else {
                cancelPrediction(currentPrediction.value.id);
              }
            }
          }
        }
      }

      if (oldVal && oldVal.state === 'stopped' && newVal.state === 'running') {
        if (currentPoll.value) {
          endPoll(currentPoll.value.id);
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
    currentPoll.value = {
      id: resp.body.data[0].id,
      runId: runId,
    };
    nodecg.log.info('[PollsAndPredictions] Poll created');
  } catch (err) {
    nodecg.log.error('[PollsAndPredictions] Failed to create a new Poll', err);
    currentPoll.value = undefined;
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
    currentPoll.value = undefined;
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
async function createPredictionWinner(runId: string, title: string, teams: RunDataTeam[], duration: number): Promise<void> {
  if (teams.length == 2) {
    await createPredictionWinnerWithAPI(runId, title, teams, duration);
  } else if (teams.length < 11) {
    await createPredictionWinnerWithGQL(runId, title, teams, duration);
  }
}
async function createPredictionWinnerWithAPI(runId: string, title: string, teams: RunDataTeam[], duration: number) {
  try {
    var data: SendMessageArgsMap['twitchAPIRequest'] = {
      method: 'post',
      endpoint: predictionEndpoint,
      data: {
        broadcaster_id: config.broadcaster_id,
        title: title,
        outcomes: teams.map((team) => { return { title: getTeamNameForPollOrPrediction(team) }; }),
        prediction_window: duration
      },
      newAPI: true,
    };
    var resp = await speedcontrol.sendMessage('twitchAPIRequest', data);
    currentPrediction.value = {
      id: resp.body.data[0].id,
      runId: runId,
      type: PredictionType.Winner,
      outcomes: teams.map((team, index) => { return { id: resp.body.data[0].outcomes[index].id, teamId: team.id }; }),
      status: PredictionStatus.ACTIVE,
    };
    nodecg.log.info('[PollsAndPredictions] Prediction created');
  }
  catch (err) {
    nodecg.log.error('[PollsAndPredictions] Failed to create a new Prediction', err);
    currentPrediction.value = undefined;
  }
}
async function createPredictionWinnerWithGQL(runId: string, title: string, teams: RunDataTeam[], duration: number) {
  try {
    if (!config2.gqlOAuth || !config2.clientID) {
      throw new Error(`config2.gqlOAuth || !config2.clientID`);
    }

    var data = [
      {
        operationName: 'createPredictionEvent',
        variables: {
          input: {
            title: title,
            channelID: config.broadcaster_id,
            outcomes: teams.map((team) => { return { title: getTeamNameForPollOrPrediction(team), color: 'BLUE' }; }),
            predictionWindowSeconds: duration
          }
        },
        extensions: {
          persistedQuery: {
            version: 1,
            sha256Hash: '92268878ac4abe722bcdcba85a4e43acdd7a99d86b05851759e1d8f385cc32ea'
          }
        }
      }
    ];

    const resp = await needle(
      'post',
      'https://gql.twitch.tv/gql',
      data,
      {
        headers: {
          Authorization: 'OAuth ' + config2.gqlOAuth,
          'Client-ID': config2.clientID,
          'User-Agent': 'gtam-layouts',
          'Content-Type': 'application/json',
        },
      },
    );

    if (resp.statusCode !== 200) {
      throw new Error(`Status Code: ${resp.statusCode} - Body: ${JSON.stringify(resp.body)}`);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: parser exists but isn't in the typings
    } else if (resp.parser !== 'json') {
      throw new Error('Response was not JSON');
    }
    if (resp.body[0].data.createPredictionEvent.error) {
      throw new Error(`Status Code: createPredictionEvent error - Body: ${JSON.stringify(resp.body)}`);
    }
    if (!resp.body[0].data.createPredictionEvent.predictionEvent) {
      throw new Error(`Status Code: no predictionEvent error - Body: ${JSON.stringify(resp.body)}`);
    }
    currentPrediction.value = {
      id: resp.body[0].data.createPredictionEvent.predictionEvent.id,
      runId: runId,
      type: PredictionType.Winner,
      outcomes: teams.map((team, index) => { return { id: resp.body[0].data.createPredictionEvent.predictionEvent.outcomes[index].id, teamId: team.id }; }),
      status: PredictionStatus.ACTIVE,
    };

    nodecg.log.info('[PollsAndPredictions] Prediction created');
  }
  catch (err) {
    nodecg.log.error('[PollsAndPredictions] Failed to create a new Prediction', err);
    currentPrediction.value = undefined;
    if (teams.length < 6) {
      nodecg.log.info('[PollsAndPredictions] Creating a poll instead');
      createPoll(
        runId,
        title, // 60 characters limit
        teams.map((team) => { return getTeamNameForPollOrPrediction(team) }),
        1800,
      );
    }
  }
}
async function createPredictionGoalTime(runId: string, title: string, goalTimeString: string, duration: number, teamId: string): Promise<void> {
  try {
    var data: SendMessageArgsMap['twitchAPIRequest'] = {
      method: 'post',
      endpoint: predictionEndpoint,
      data: {
        broadcaster_id: config.broadcaster_id,
        title: title,
        outcomes: [{ 'title': 'Under ' + goalTimeString }, { 'title': goalTimeString + ' or over' }],
        prediction_window: duration
      },
      newAPI: true,
    }
    var resp = await speedcontrol.sendMessage('twitchAPIRequest', data);
    currentPrediction.value = {
      id: resp.body.data[0].id,
      runId: runId,
      type: PredictionType.GoalTime,
      outcomes: [{ id: resp.body.data[0].outcomes[0].id, teamId: teamId }, { id: resp.body.data[0].outcomes[1].id, teamId: teamId }],
      goalTime: parseDuration(goalTimeString),
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