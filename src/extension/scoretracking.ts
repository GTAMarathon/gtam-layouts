import fs from "fs";
import { get } from "./util/nodecg";
import { Configschema } from "@gtam-layouts/types/schemas";
import { RunDataActiveRun, RunDataPlayer, Timer } from "nodecg/bundles/nodecg-speedcontrol/src/types";

const nodecg = get();
const config = (nodecg.bundleConfig as Configschema).scoreTracking;
const runDataActiveRun = nodecg.Replicant<RunDataActiveRun>('runDataActiveRun', 'nodecg-speedcontrol');
const timer = nodecg.Replicant<Timer>('timer', 'nodecg-speedcontrol');

var players: RunDataPlayer[] = [];

if (config.enabled) {
  nodecg.log.info('[Score Tracking] Enabled');

  runDataActiveRun.on('change', (newVal, oldVal) => {
    if (newVal) {
      players = newVal.teams.flatMap(team => team.players) || [];
      players.forEach(player => {
        if (!player.customData['score']) {
          player.customData['score'] = '0';
        }
        if (!player.customData['rank']) {
          player.customData['rank'] = '999';
        }
      });
    } else {
      players = []
    }
  });

  timer.on('change', (newVal, oldVal) => {
    if (newVal?.teamFinishTimes?.length &&
      (!oldVal?.teamFinishTimes?.length || (newVal?.teamFinishTimes?.length > oldVal?.teamFinishTimes?.length))) {
      rankPlayers();
    }
    if(newVal.state=="running" && oldVal && oldVal.state =="stopped"){
      players.forEach(player => player.customData['score'] = '0');
    }
  });

  updateScore();
  fs.watch(config.scorePath, (event:string) => {
    if (event ==='change') {
      updateScore();
    }
  });
}

function rankPlayers() {
  players.sort((a, b) => +a.customData['rank'] - +b.customData['rank']);
  players.sort((a, b) => +b.customData['score'] - +a.customData['score']);
  players.sort((a, b) => {
    var finishA = timer.value?.teamFinishTimes[a.teamID] || undefined;
    var finishB = timer.value?.teamFinishTimes[b.teamID] || undefined;

    var ret = 0;
    if (finishA?.state != 'completed' && finishB?.state != 'completed') {
      ret = 0;
    }
    else if (finishA?.state != 'completed' && finishB?.state == "completed") {
      ret = 1;
    }
    else if (finishA?.state == 'completed' && finishB?.state != "completed") {
      ret = -1;
    } else {
      ret = finishA.milliseconds - finishB.milliseconds;
    }
    return ret;
  });

  players.forEach((player, index) => player.customData['rank'] = (index + 1).toString());
}

async function updateScore(): Promise<void> {
  nodecg.log.info("[Score Tracking] updating data");
  try {
    var values: {
      name: string;
      score: number;
    }[] = [];
    const data = fs.readFileSync(config.scorePath, 'latin1');
    data.split(/\r?\n/).forEach(line => {
      values.push({
        name: line.substring(0, 20).trim(),
        score: parseInt(line.substring(20).trim())
      });
    });

    values.forEach(value => {
      if (value.name && value.score) {
        players.filter(player => player.name.trim().toLowerCase() == value.name.toLowerCase()).forEach(player => player.customData['score'] = value.score.toString());
      }else{
        nodecg.log.warn("[Score Tracking] data invalid or 0", data);
      }
    });

    rankPlayers();
    nodecg.log.debug("[Score Tracking] Data updated");
  } catch (err) {
    nodecg.log.warn("[Score Tracking] Error updating data");
    nodecg.log.debug("[Score Tracking] Error updating data", err);
  }

}
