import needle from 'needle';
import { get } from './util/nodecg';
import { Configschema } from '../types/schemas/configschema';
import { RunDataActiveRun } from '../../../nodecg-speedcontrol/src/types/schemas';

const nodecg = get();
const config = (nodecg.bundleConfig as Configschema).twitchExt;
const currentRun = nodecg.Replicant<RunDataActiveRun>('runDataActiveRun', 'nodecg-speedcontrol');

async function setChannels(usernames: string): Promise<void> {
  nodecg.log.info('[Twitch Ext] Attempting to update');
  try {
    const resp = await needle(
      'get',
      `https://api.furious.pro/featuredchannels/bot/${config.token}/${usernames}`,
    );

    if (resp.statusCode === 200) {
      nodecg.log.info(`[Twitch Ext] Successfully updated channels to ${usernames}`);
    } else {
      throw new Error(`Status Code ${resp.statusCode}`);
    }
  } catch (err) {
    nodecg.log.warn('[Twitch Ext] Error updating');
    nodecg.log.debug('[Twitch Ext] Error updating:', err);
  }
}

currentRun.on('change', (newVal) => {
  if (config.enable && newVal && newVal.teams) {
    var channels: string[] = [];
    newVal.teams.forEach(function (team) {
      team.players.forEach(function (player) {
        if(player.social.twitch){
          channels.push(player.social.twitch);
        }
      })
    })
    setChannels(channels.join(','));
  }
})
