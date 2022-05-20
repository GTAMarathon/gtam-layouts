/* eslint @typescript-eslint/ban-ts-ignore: off */

import obsWebsocketJs from 'obs-websocket-js';
import { Configschema } from '../../types/schemas/configschema';
import { get } from './nodecg';
import { RunData } from '../../../../nodecg-speedcontrol/src/types';
import { RunDataActiveRunSurrounding, RunDataArray, RunDataActiveRun } from '../../../../nodecg-speedcontrol/src/types/schemas';
import { setStartHighlight, setEndAndCreateHighlight } from './twitch-highlight';

enum VideoFolder {
  III = 'III',
  IIIDE = 'IIIDE',
  VC = 'VC',
  VCDE = 'VCDE',
  SA = 'SA',
  SADE = 'SADE',
  LCS = 'LCS',
  VCS = 'VCS',
  IV = 'IVEFLC',
  V = 'V'
}

enum MusicFolder {
  _2 = "2",
  III = 'III',
  VC = 'VC',
  SA = 'SA',
  LCS = 'LCS',
  VCS = 'VCS',
  IV = 'IV',
  CW = 'CW',
  EFLC = 'EFLC',
  V = 'V',
  Yakuza = 'Yakuza',
  Mix = 'Mix',
}

const nodecg = get();
const runDataActiveRunSurrounding = nodecg.Replicant<RunDataActiveRunSurrounding>('runDataActiveRunSurrounding', 'nodecg-speedcontrol');
const runDataArray = nodecg.Replicant<RunDataArray>('runDataArray', 'nodecg-speedcontrol');
const runDataActiveRun = nodecg.Replicant<RunDataActiveRun>('runDataActiveRun', 'nodecg-speedcontrol');
const config = (nodecg.bundleConfig as Configschema);

// Extending the OBS library with some of our own functions.
class OBSUtility extends obsWebsocketJs {
  /**
   * Change to this OBS scene.
   * @param name Name of the scene.
   */
  async changeScene(name: string): Promise<void> {
    try {
      await this.send('SetCurrentScene', { 'scene-name': name });
    } catch (err) {
      nodecg.log.warn(`Cannot change OBS scene [${name}]: ${err.error}`);
      throw err;
    }
  }

  /**
   * Change to the intermission based on name in config.
   */
  async changeToIntermission(): Promise<void> {
    try {
      await this.changeIntermissionVid();
      await new Promise(r => setTimeout(r, 500));

      await this.changeScene(config.obs.names.scenes.intermission);

      await this.setStudioModeOnTheNextGameScene();


    } catch (err) {
      nodecg.log.warn('error during changeToIntermission', err);
    }
  }

  async setStudioModeOnTheNextGameScene(): Promise<void> {
    let index = runDataArray.value.findIndex((run: RunData) => run.id === runDataActiveRunSurrounding.value.next);
    let nextRun = runDataArray.value[index] || null;
    var allScenes = Object.values(config.obs.names.scenes);

    await new Promise(r => setTimeout(r, 500));

    if (nextRun && allScenes && allScenes.includes(nextRun.customData.obsScene)) {
      this.send('GetStudioModeStatus').then(response => {
        if (!response['studio-mode']) {
          this.send('EnableStudioMode').then(() => {
            this.send('SetPreviewScene', { 'scene-name': nextRun.customData.obsScene }).catch((err) => {
              nodecg.log.warn('StudioMode not enabled', err);
            });
          }).catch((err) => {
            nodecg.log.warn('couldnt enable StudioMode', err);
          });
        } else {
          this.send('SetPreviewScene', { 'scene-name': nextRun.customData.obsScene }).catch((err) => {
            nodecg.log.warn('preview scene not set', err);
          });
        }
      }).catch((err) => {
        nodecg.log.warn('couldnt get StudioModeStatus', err);
      });
    }
  }

  async setTwitchUrlToSources(twitch: string|undefined, sources: (string | undefined)[]): Promise<void> {
    for (var source of sources) {
      if (source && twitch) {
        var url = config.feeds.playerUrl.replace(new RegExp('{{twitchAccount}}', 'g'), twitch);
        await this.send('SetSourceSettings', {
          'sourceName': source,
          'sourceType': 'browser_source',
          'sourceSettings': { 'url': url }
        }).catch((err) => {
          nodecg.log.warn('url not set to source', err);
        });
      }
    }
  }

  async changeRunnersFeedOnScreenWithScore(data: { feeds: RunDataActiveRun['teams'][number][], numberOfFeeds: number }): Promise<void> {
    if (data.numberOfFeeds != data.feeds.length) {
      nodecg.log.error('[changeRunnersFeedOnScreenWithScore] error number of feeds doesnt match');
      return;
    }
    var index = -1;
    var scene: string = '';
    var array: RunDataActiveRun['teams'][number][];
    switch (data.numberOfFeeds) {
      case 5:
        array = runDataActiveRun.value.teams.filter(team => team.id == data.feeds[4].id);
        if (array.length) {
          index = runDataActiveRun.value.teams.indexOf(array[0]);
          if (index > -1) {
            runDataActiveRun.value.teams.splice(index, 1);
            runDataActiveRun.value.teams.unshift(data.feeds[4]);
            this.setTwitchUrlToSources(data.feeds[4].players[0].social.twitch || undefined, [config.obs.names.sources.runner5_43]);
            if (!scene) { scene = config.obs.names.scenes._5p43_score; }
          }
        } else {
          nodecg.log.error('[changeRunnersFeedOnScreenWithScore] Feed 5 not found');
          return;
        }
      case 4:
        array = runDataActiveRun.value.teams.filter(team => team.id == data.feeds[3].id);
        if (array.length) {
          index = runDataActiveRun.value.teams.indexOf(array[0]);
          if (index > -1) {
            runDataActiveRun.value.teams.splice(index, 1);
            runDataActiveRun.value.teams.unshift(data.feeds[3]);
            this.setTwitchUrlToSources(data.feeds[3].players[0].social.twitch || undefined, [config.obs.names.sources.runner4_43]);
            if (!scene) { scene = config.obs.names.scenes._4p43_score; }
          }
        } else {
          nodecg.log.error('[changeRunnersFeedOnScreenWithScore] Feed 4 not found');
          return;
        }
      case 3:
        array = runDataActiveRun.value.teams.filter(team => team.id == data.feeds[2].id);
        if (array.length) {
          index = runDataActiveRun.value.teams.indexOf(array[0]);
          if (index > -1) {
            runDataActiveRun.value.teams.splice(index, 1);
            runDataActiveRun.value.teams.unshift(data.feeds[2]);
            this.setTwitchUrlToSources(data.feeds[2].players[0].social.twitch || undefined, [config.obs.names.sources.runner3_43]);
            if (!scene) { scene = config.obs.names.scenes._3p43_score; }
          }
        } else {
          nodecg.log.error('[changeRunnersFeedOnScreenWithScore] Feed 3 not found');
          return;
        }
      case 2:
        array = runDataActiveRun.value.teams.filter(team => team.id == data.feeds[1].id);
        if (array.length) {
          index = runDataActiveRun.value.teams.indexOf(array[0]);
          if (index > -1) {
            runDataActiveRun.value.teams.splice(index, 1);
            runDataActiveRun.value.teams.unshift(data.feeds[1]);
            this.setTwitchUrlToSources(data.feeds[1].players[0].social.twitch || undefined, [config.obs.names.sources.runner2_43]);
            if (!scene) { scene = config.obs.names.scenes._2p43_score; }
          }
        } else {
          nodecg.log.error('[changeRunnersFeedOnScreenWithScore] Feed 2 not found');
          return;
        }
      case 1:
        array = runDataActiveRun.value.teams.filter(team => team.id == data.feeds[0].id);
        if (array.length) {
          index = runDataActiveRun.value.teams.indexOf(array[0]);
          if (index > -1) {
            runDataActiveRun.value.teams.splice(index, 1);
            runDataActiveRun.value.teams.unshift(data.feeds[0]);
            this.setTwitchUrlToSources(data.feeds[0].players[0].social.twitch || undefined, [config.obs.names.sources.runner1_43]);
            if (!scene) { scene = config.obs.names.scenes._1p43_score; }
          }
        } else {
          nodecg.log.error('[changeRunnersFeedOnScreenWithScore] Feed 1 not found');
          return;
        }
        break;
      default:
        nodecg.log.error('[changeRunnersFeedOnScreenWithScore] error number of feeds not valid');
        return;
    }
    await this.changeScene(scene);
  }

  async focusOnRunnerX(runnerNumber: number): Promise<void> {
    switch (runnerNumber) {
      case 1: {
        await this.changeScene(config.obs.names.scenes._4p169_1);
        this.toggleSourceAudio(config.obs.names.sources.runner1_169, false).catch(() => { });
        this.toggleSourceAudio(config.obs.names.sources.runner2_169, true).catch(() => { });
        this.toggleSourceAudio(config.obs.names.sources.runner3_169, true).catch(() => { });
        this.toggleSourceAudio(config.obs.names.sources.runner4_169, true).catch(() => { });
        break;
      }
      case 2: {
        await this.changeScene(config.obs.names.scenes._4p169_2);
        this.toggleSourceAudio(config.obs.names.sources.runner1_169, true).catch(() => { });
        this.toggleSourceAudio(config.obs.names.sources.runner2_169, false).catch(() => { });
        this.toggleSourceAudio(config.obs.names.sources.runner3_169, true).catch(() => { });
        this.toggleSourceAudio(config.obs.names.sources.runner4_169, true).catch(() => { });
        break;
      }
      case 3: {
        await this.changeScene(config.obs.names.scenes._4p169_3);
        this.toggleSourceAudio(config.obs.names.sources.runner1_169, true).catch(() => { });
        this.toggleSourceAudio(config.obs.names.sources.runner2_169, true).catch(() => { });
        this.toggleSourceAudio(config.obs.names.sources.runner3_169, false).catch(() => { });
        this.toggleSourceAudio(config.obs.names.sources.runner4_169, true).catch(() => { });
        break;
      }
      case 4: {
        await this.changeScene(config.obs.names.scenes._4p169_4);
        this.toggleSourceAudio(config.obs.names.sources.runner1_169, true).catch(() => { });
        this.toggleSourceAudio(config.obs.names.sources.runner2_169, true).catch(() => { });
        this.toggleSourceAudio(config.obs.names.sources.runner3_169, true).catch(() => { });
        this.toggleSourceAudio(config.obs.names.sources.runner4_169, false).catch(() => { });
        break;
      }
      default: {
        nodecg.log.warn('invalid runner number' + runnerNumber);
        return;
      }
    }
  }

  // Change intermission video 
  async changeIntermissionVid(): Promise<void> {
    try {
      let index = runDataArray.value.findIndex((run: RunData) => run.id === runDataActiveRunSurrounding.value.next)
      let nextRun = runDataArray.value[index] || null;
      if (nextRun && nextRun.gameTwitch == 'Just Chatting') {
        nextRun = runDataArray.value[index + 1] || null;
      }
      let videoFolder;
      let musicFolder;
      if (nextRun) {
        switch (nextRun.game) {
          case 'Grand Theft Auto':
            // no specific video
            // no specific music
            break;
          case 'Grand Theft Auto: London 1969':
            // no specific video
            // no specific music
            break;
          case 'Grand Theft Auto: London 1961':
            // no specific video
            // no specific music
            break;
          case 'Grand Theft Auto Advance':
            // no specific video
            // no specific music
            break;
          case 'Grand Theft Auto 2':
            // no specific video
            musicFolder = MusicFolder._2;
            break;
          case 'Grand Theft Auto III':
            videoFolder = VideoFolder.III;
            musicFolder = MusicFolder.III;
            break;
          case 'Grand Theft Auto III: The Definitive Edition':
          case 'Grand Theft Auto III - The Definitive Edition':
          case 'Grand Theft Auto III – The Definitive Edition':
            videoFolder = VideoFolder.IIIDE;
            musicFolder = MusicFolder.III;
            break;
          case 'Grand Theft Auto: Vice City':
            videoFolder = VideoFolder.VC;
            musicFolder = MusicFolder.VC;
            break;
          case 'Grand Theft Auto: Vice City - The Definitive Edition':
          case 'Grand Theft Auto: Vice City – The Definitive Edition':
            videoFolder = VideoFolder.VCDE;
            musicFolder = MusicFolder.VC;
            break;
          case 'Grand Theft Auto: San Andreas':
            videoFolder = VideoFolder.SA;
            musicFolder = MusicFolder.SA;
            break;
          case 'Grand Theft Auto: San Andreas - The Definitive Edition':
          case 'Grand Theft Auto: San Andreas – The Definitive Edition':
            videoFolder = VideoFolder.SADE;
            musicFolder = MusicFolder.SA;
            break;
          case 'Grand Theft Auto: Liberty City Stories':
            videoFolder = VideoFolder.LCS;
            musicFolder = MusicFolder.LCS;
            break;
          case 'Grand Theft Auto: Vice City Stories':
            videoFolder = VideoFolder.VCS;
            musicFolder = MusicFolder.VCS;
            break;
          case 'Grand Theft Auto IV':
            videoFolder = VideoFolder.IV;
            musicFolder = MusicFolder.IV;
            break;
          case 'Grand Theft Auto: Chinatown Wars':
            // no specific video
            musicFolder = MusicFolder.CW;
            break;
          case 'Grand Theft Auto: The Lost and Damned':
          case 'Grand Theft Auto IV: The Lost and Damned':
            videoFolder = VideoFolder.IV;
            musicFolder = MusicFolder.EFLC;
            break;
          case 'Grand Theft Auto: The Ballad of Gay Tony':
            videoFolder = VideoFolder.IV;
            musicFolder = MusicFolder.EFLC;
            break;
          case 'Grand Theft Auto V':
            videoFolder = VideoFolder.V;
            musicFolder = MusicFolder.V;
            break;
          case 'Grand Theft Auto Online':
            videoFolder = VideoFolder.V;
            musicFolder = MusicFolder.V;
            break;
          case 'Yakuza 3':
            // no specific video
            musicFolder = MusicFolder.Yakuza;
            break;
          default:
            // no specific video
            // no specific music
            break;
        }

        // no specific video
        if (!videoFolder) {
          const keys = Object.keys(VideoFolder);
          const random = keys[Math.floor(Math.random() * keys.length)];
          // @ts-ignore
          videoFolder = VideoFolder[random];
        }

        await this.send('SetSourceSettings', {
          'sourceName': config.obs.names.sources.intermissionVideo,
          'sourceType': 'vlc_source',
          'sourceSettings': {
            'playlist': [{ 'hidden': false, 'selected': false, 'value': config.obs.names.paths.intermissionVideo + '/' + videoFolder }],
            'shuffle': true
          }
        }).catch((err) => {
          nodecg.log.warn("[OBS] Couldn't set intermission video", err);
        });


        // no specific music
        if (!musicFolder) {
          musicFolder = MusicFolder.Mix;
        }
        await this.send('SetSourceSettings', {
          'sourceName': config.obs.names.sources.intermissionMusic,
          'sourceType': 'vlc_source',
          'sourceSettings': {
            'playlist': [{ 'hidden': false, 'selected': false, 'value': config.obs.names.paths.intermissionMusic + '/' + musicFolder }],
            'shuffle': true
          }
        }).catch((err) => {
          nodecg.log.warn("[OBS] Couldn't set intermission music", err);
        });
      }
    } catch (err) {
      // err
    }
    setEndAndCreateHighlight();
  }

  /**
   * Mute or unmute the named OBS source.
   * @param source Name of the source.
   */
  async toggleSourceAudio(source: string, mute = true): Promise<void> {
    try {
      await this.send('SetMute', { source, mute });
    } catch (err) {
      nodecg.log.warn(`Cannot mute OBS source [${source}]: ${err.error}`);
      throw err;
    }
  }

  /**
   * Mute all audio sources listed in the config.
   */
  async muteAudio(): Promise<void> {
    config.obs.names.audioToMute.forEach((source) => {
      this.toggleSourceAudio(source, true).catch(() => { });
    });
  }

  /**
   * Unmute all audio sources listed in the config.
   */
  async unmuteAudio(): Promise<void> {
    config.obs.names.audioToUnmute.forEach((source) => {
      this.toggleSourceAudio(source, false).catch(() => { });
    });
  }
}

const obs = new OBSUtility();
const settings = {
  address: config.obs.address,
  password: config.obs.password,
};

function connect(): void {
  obs.connect(settings).then(() => {
    nodecg.log.info('OBS connection successful.');
  }).catch((err) => {
    nodecg.log.warn('OBS connection error.');
    nodecg.log.debug('OBS connection error:', err);
  });
}

if (config.obs.enable) {
  nodecg.log.info('Setting up OBS connection.');
  connect();
  obs.on('ConnectionClosed', () => {
    nodecg.log.warn('OBS connection lost, retrying in 5 seconds.');
    setTimeout(connect, 5000);
  });

  // @ts-ignore: Pretty sure this emits an error.
  obs.on('error', (err) => {
    nodecg.log.warn('OBS connection error.');
    nodecg.log.debug('OBS connection error:', err);
  });

  // @ts-ignore: 
  obs.on('MediaStarted', (data) => {
    // @ts-ignore: 
    if (data['sourceName'] == config.obs.names.sources.intermissionVideo) {
      // @ts-ignore: 
      obs.send('SetMediaTime', {
        'sourceName': config.obs.names.sources.intermissionVideo,
        'timestamp': Math.floor(Math.random() * 360000) // random from 0 to 6:00
      }).catch((err) => {
        nodecg.log.warn("[OBS] Couldn't set intermission video timestamp", err);
      });
    }
  });

  obs.on('TransitionBegin', (data) => {
    if (data['from-scene'] == config.obs.names.scenes.intermission) {
      setStartHighlight();
    }
  });
}

export default obs;
