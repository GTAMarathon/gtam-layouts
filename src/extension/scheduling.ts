import { Configschema } from '@gtam-layouts/types/schemas';
import { ExtensionReturn, OengusLine, RunData, RunDataArray, RunFinishTimes, Timer } from '../../../nodecg-speedcontrol/src/types';
import { OengusImportStatus } from '../../../nodecg-speedcontrol/src/types/schemas/oengusImportStatus';
import { RunDataActiveRunSurrounding } from '../../../nodecg-speedcontrol/src/types/schemas/runDataActiveRunSurrounding';
import { get } from './util/nodecg';

const nodecg = get();
const { sendMessage } = nodecg.extensions['nodecg-speedcontrol'] as unknown as ExtensionReturn;
const timer = nodecg.Replicant<Timer>('timer', 'nodecg-speedcontrol');
const runDataArray = nodecg.Replicant<RunDataArray>('runDataArray', 'nodecg-speedcontrol');
const runDataActiveRunSurrounding = nodecg.Replicant<RunDataActiveRunSurrounding>('runDataActiveRunSurrounding', 'nodecg-speedcontrol');
const runFinishTimes = nodecg.Replicant<RunFinishTimes>('runFinishTimes', 'nodecg-speedcontrol');
const oengusImportStatus = nodecg.Replicant<OengusImportStatus>('oengusImportStatus', 'nodecg-speedcontrol');
const config = (nodecg.bundleConfig as Configschema).schedule;

const gameNameMap = new Map<string, { gameShort: string, gameTwitch: string }>([
  ['Grand Theft Auto', { gameShort: 'GTA', gameTwitch: 'Grand Theft Auto' }],
  ['Grand Theft Auto 2', { gameShort: 'GTA 2', gameTwitch: 'Grand Theft Auto 2' }],
  ['Grand Theft Auto III', { gameShort: 'GTA III', gameTwitch: 'Grand Theft Auto III' }],
  ['Grand Theft Auto: Vice City', { gameShort: 'GTA Vice City', gameTwitch: 'Grand Theft Auto: Vice City' }],
  ['Grand Theft Auto: San Andreas', { gameShort: 'GTA San Andreas', gameTwitch: 'Grand Theft Auto: San Andreas' }],
  ['Grand Theft Auto Advance', { gameShort: 'GTA Advance', gameTwitch: 'Grand Theft Auto Advance' }],
  ['Grand Theft Auto: Liberty City Stories', { gameShort: 'GTA Liberty City Stories', gameTwitch: 'Grand Theft Auto: Liberty City Stories' }],
  ['Grand Theft Auto: Vice City Stories', { gameShort: 'GTA Vice City Stories', gameTwitch: 'Grand Theft Auto: Vice City Stories' }],
  ['Grand Theft Auto IV', { gameShort: 'GTA IV', gameTwitch: 'Grand Theft Auto IV' }],
  ['Grand Theft Auto: The Lost and Damned', { gameShort: 'GTA The Lost and Damned', gameTwitch: 'Grand Theft Auto IV: The Lost and Damned' }],
  ['Grand Theft Auto: Chinatown Wars', { gameShort: 'GTA Chinatown Wars', gameTwitch: 'Grand Theft Auto: Chinatown Wars' }],
  ['Grand Theft Auto: The Ballad of Gay Tony', { gameShort: 'GTA The Ballad of Gay Tony', gameTwitch: 'Grand Theft Auto IV: The Ballad of Gay Tony' }],
  ['Grand Theft Auto V', { gameShort: 'GTA V', gameTwitch: 'Grand Theft Auto V' }],
  ['Grand Theft Auto Online', { gameShort: 'GTA Online', gameTwitch: 'Grand Theft Auto V' }],
  ['Multi Theft Auto', { gameShort: 'MTA', gameTwitch: 'Grand Theft Auto: San Andreas' }],
  ['Grand Theft Auto III: The Definitive Edition', { gameShort: 'GTA III DE', gameTwitch: 'Grand Theft Auto III: The Definitive Edition' }],
  ['Grand Theft Auto: Vice City - The Definitive Edition', { gameShort: 'GTA Vice City DE', gameTwitch: 'Grand Theft Auto: Vice City – The Definitive Edition' }],
  ['Grand Theft Auto: San Andreas - The Definitive Edition', { gameShort: 'GTA San Andreas DE', gameTwitch: 'Grand Theft Auto: San Andreas – The Definitive Edition' }],

  ['Bully: Scholarship Edition', { gameShort: 'Bully: Scholarship Edition', gameTwitch: 'Bully: Scholarship Edition' }],
  ['Driver', { gameShort: 'Driver', gameTwitch: 'Driver' }],
  ['DRIV3R', { gameShort: 'DRIV3R', gameTwitch: 'Driv3r' }],
  ['Driver: Parallel Lines', { gameShort: 'Driver: Parallel Lines', gameTwitch: 'Driver: Parallel Lines' }],
  ["Driver '76", { gameShort: "Driver '76", gameTwitch: "Driver 76" }],
  ['Just Cause', { gameShort: 'Just Cause', gameTwitch: 'Just Cause' }],
  ['Mafia: The City of Lost Heaven', { gameShort: 'Mafia', gameTwitch: 'Mafia' }],
  ['Mafia II', { gameShort: 'Mafia II', gameTwitch: 'Mafia II' }],
  ['Mafia: Definitive Edition', { gameShort: 'Mafia: Definitive Edition', gameTwitch: 'Mafia: Definitive Edition' }],
  ['Red Dead Redemption', { gameShort: 'Red Dead Redemption', gameTwitch: 'Red Dead Redemption' }],
  ['Red Dead Redemption: Undead Nightmare', { gameShort: 'RDR Undead Nightmare', gameTwitch: 'Red Dead Redemption: Undead Nightmare' }],
  ['Retro City Rampage', { gameShort: 'Retro City Rampage', gameTwitch: 'Retro City Rampage' }],
  ['Saints Row', { gameShort: 'Saints Row', gameTwitch: 'Saints Row' }],
  ['Saints Row: The Third', { gameShort: 'Saints Row: The Third', gameTwitch: 'Saints Row: The Third' }],
  ['Saints Row IV', { gameShort: 'Saints Row IV', gameTwitch: 'Saints Row IV' }],
  ['Shenmue II', { gameShort: 'Shenmue II', gameTwitch: 'Shenmue II' }],
  ['Sleeping Dogs', { gameShort: 'Sleeping Dogs', gameTwitch: 'Sleeping Dogs' }],
  ['Teardown', { gameShort: 'Teardown', gameTwitch: 'Teardown' }],
  ['The Godfather: The Game', { gameShort: 'The Godfather', gameTwitch: 'The Godfather' }],
  ['The Saboteur', { gameShort: 'The Saboteur', gameTwitch: 'The Saboteur' }],
  ['The Simpsons: Hit & Run', { gameShort: 'The Simpsons: Hit & Run', gameTwitch: 'The Simpsons: Hit & Run' }],
  ['Total Overdose', { gameShort: 'Total Overdose', gameTwitch: 'Total Overdose' }],
  ['True Crime: Streets of LA', { gameShort: 'True Crime: Streets of LA', gameTwitch: 'True Crime: Streets of LA' }],
  ['True Crime: New York City', { gameShort: 'True Crime: New York City', gameTwitch: 'True Crime: New York City' }],
  ['Watch_Dogs', { gameShort: 'Watch_Dogs', gameTwitch: 'Watch_Dogs' }],
  ['WATCH_DOGS 2', { gameShort: 'WATCH_DOGS 2', gameTwitch: 'Watch Dogs 2' }],
  ['Watch Dogs: Legion', { gameShort: 'Watch Dogs: Legion', gameTwitch: 'Watch Dogs: Legion' }],
  ['Yakuza 3 Remastered', { gameShort: 'Yakuza 3 Remastered', gameTwitch: 'Yakuza 3 Remastered' }]
]);

oengusImportStatus.on('change', (newVal, oldVal) => {
  if (config.enable) {
    if (oldVal && oldVal.importing === true && newVal && newVal.importing === false) {
      // FIX gameTwitch & gameShort
      runDataArray.value.forEach(runData => {
        if (runData.game && gameNameMap.has(runData.game)) {
          var values = gameNameMap.get(runData.game);
          if (values) {
            runData.gameTwitch = values.gameTwitch;
            runData.customData['gameShort'] = values.gameShort;
          }
        }
      });
    }
  }
});

timer.on('change', (newVal, oldVal) => {
  if (oldVal && oldVal.state === 'stopped' && newVal && newVal.state === 'running') {
    updateOengusScheduleOnRunStart();
  }
});

async function updateOengusScheduleOnRunStart(): Promise<void> {
  if (config.enable) {
    try {
      await sendMessage('importOengusSchedule', { marathonShort: config.marathonShort, useJapanese: false });
      var now = Math.floor(Date.now() / 1000);
      if (runDataActiveRunSurrounding.value.current) {
        var currentRun = runDataArray.value.find((run) => run.id === runDataActiveRunSurrounding.value.current);
        if (currentRun && currentRun.scheduledS && currentRun.externalID) {
          var setupTimeS = now - currentRun.scheduledS;
          if (setupTimeS > 0) {
            var lines: Partial<OengusLine>[] = [];
            lines.push({
              id: parseInt(currentRun.externalID),
              setupTime: 'PT' + setupTimeS + 'S',
            });

            if (currentRun.setupTimeS != null) {
              var delta = currentRun.setupTimeS - setupTimeS;
              lines = lines.concat(editSetupBufferLengthToCompensateDelta(currentRun, delta));
            }

            await sendMessage('updateOengusSchedule', { marathonShort: config.marathonShort, lines: lines });
            await sendMessage('importOengusSchedule', { marathonShort: config.marathonShort, useJapanese: false });
          }
        }
      }
      nodecg.log.info('[Schedule] updated schedule');
    } catch (err) {
      nodecg.log.error('[Schedule] Cannot update schedule', err);
    }
  }
}
export async function updateOengusScheduleOnSwitchingRun(): Promise<void> {
  if (config.enable) {
    try {
      var now = Math.floor(Date.now() / 1000);
      var lines: Partial<OengusLine>[] = [];

      if (runDataActiveRunSurrounding.value.next) {
        var nextRun = runDataArray.value.find((run) => run.id === runDataActiveRunSurrounding.value.next);
        if (nextRun && nextRun.scheduledS) {
          var delta = nextRun.scheduledS - now;

          if (runDataActiveRunSurrounding.value.current) {
            var run = runDataArray.value.find((run) => run.id === runDataActiveRunSurrounding.value.current);
            if (!run) {
              throw new Error('no active run');
            }
            else if (!run.externalID) {
              throw new Error('no externalID');
            }
            else
              if (!run.scheduledS) {
                throw new Error('no scheduled start');
              }

              else if (!runFinishTimes.value[run.id]) {
                throw new Error('run not finished');
              }

              else if (run.scheduledS > now) {
                throw new Error('start>finish');
              }

              else {
                var runFinishDurationS = Math.floor(runFinishTimes.value[run.id].milliseconds / 1000);
                var runSetupTimeS = now - run.scheduledS - runFinishDurationS;
                if (runSetupTimeS < 0) {
                  throw new Error('cannot have a negative setup time');
                }
                lines.push({
                  id: parseInt(run.externalID),
                  estimate: 'PT' + runFinishDurationS + 'S',
                  setupTime: 'PT' + runSetupTimeS + 'S',
                });

                //Find all setup buffer
                lines = lines.concat(editSetupBufferLengthToCompensateDelta(nextRun, delta));

                await sendMessage('updateOengusSchedule', { marathonShort: config.marathonShort, lines: lines });
                await sendMessage('importOengusSchedule', { marathonShort: config.marathonShort, useJapanese: false });
              }
          }
        }
        nodecg.log.info('[Schedule] updateOengusScheduleOnSwitchingRun success');
      }
    } catch (err) {
      nodecg.log.error('[Schedule] Cannot update schedule', err);
    }
  }
}

function editSetupBufferLengthToCompensateDelta(runData: RunData, delta: number): Partial<OengusLine>[] {
  var lines: Partial<OengusLine>[] = [];
  var bufferRunArray = runDataArray.value
    .filter(run => run.gameTwitch === 'Just Chatting' && run.externalID && run.scheduledS && runData && runData.scheduledS && run.scheduledS >= runData.scheduledS)
    .sort(((a, b) => ((a.scheduledS) as number) - ((b.scheduledS) as number)));

  if (delta > 0 && bufferRunArray.length > 0) {
    var buffer = bufferRunArray[0];
    var butterLength = buffer.estimateS || 0 + (buffer.setupTimeS || 0);
    var newSetupTimeS = butterLength + delta;
    lines.push({
      id: parseInt(bufferRunArray[0].externalID as string),
      estimate: 'PT0S',
      setupTime: 'PT' + newSetupTimeS + 'S',
    });
  } else {
    for (var i = 0; i < bufferRunArray.length && delta <= 0; i++) {
      var buffer = bufferRunArray[i];
      var butterLength = buffer.estimateS || 0 + (buffer.setupTimeS || 0);
      var newSetupTimeS = butterLength + delta;
      if (newSetupTimeS < 0) {
        newSetupTimeS = 0;
      }
      lines.push({
        id: parseInt(buffer.externalID as string),
        estimate: 'PT0S',
        setupTime: 'PT' + newSetupTimeS + 'S',
      });
      delta = newSetupTimeS;
    }
  }
  return lines;
}
