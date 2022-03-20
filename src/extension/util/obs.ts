/* eslint @typescript-eslint/ban-ts-ignore: off */

import obsWebsocketJs from 'obs-websocket-js';
import { Configschema } from '../../types/schemas/configschema';
import { get } from './nodecg';
import { RunData } from '../../../../nodecg-speedcontrol/src/types';
import { RunDataActiveRunSurrounding, RunDataArray } from '../../../../nodecg-speedcontrol/src/types/schemas';
import { setStartHighlight, setEndAndCreateHighlight } from './twitch-highlight';

enum VideoFolder {
  III = 'III',
  VC = 'VC',
  SA = 'SA',
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
const config = (nodecg.bundleConfig as Configschema).obs;

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

      await this.changeScene(config.names.scenes.intermission);

      await this.setStudioModeOnTheNextGameScene();


    } catch (err) {
      nodecg.log.warn('error during changeToIntermission', err);
    }
  }

  async setStudioModeOnTheNextGameScene(): Promise<void> {
    let index = runDataArray.value.findIndex((run: RunData) => run.id === runDataActiveRunSurrounding.value.next);
    let nextRun = runDataArray.value[index] || null;
    var allScenes = Object.values(config.names.scenes);

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

  async setUrlToSources(url: string, sources: string[]): Promise<void> {
    for (var source of sources) {
      await this.send('SetSourceSettings', {
        'sourceName': source,
        'sourceType': 'browser_source',
        'sourceSettings': { 'url': url }
      }).catch((err) => {
        nodecg.log.warn('url not set to source', err);
      });
    }
  }

  async focusOnRunnerX(runnerNumber: number): Promise<void> {
    switch (runnerNumber) {
      case 1: {
        await this.changeScene(config.names.scenes._4p169_1);
        this.toggleSourceAudio(config.names.sources.runner1_169, false).catch(() => { });
        this.toggleSourceAudio(config.names.sources.runner2_169, true).catch(() => { });
        this.toggleSourceAudio(config.names.sources.runner3_169, true).catch(() => { });
        this.toggleSourceAudio(config.names.sources.runner4_169, true).catch(() => { });
        break;
      }
      case 2: {
        await this.changeScene(config.names.scenes._4p169_2);
        this.toggleSourceAudio(config.names.sources.runner1_169, true).catch(() => { });
        this.toggleSourceAudio(config.names.sources.runner2_169, false).catch(() => { });
        this.toggleSourceAudio(config.names.sources.runner3_169, true).catch(() => { });
        this.toggleSourceAudio(config.names.sources.runner4_169, true).catch(() => { });
        break;
      }
      case 3: {
        await this.changeScene(config.names.scenes._4p169_3);
        this.toggleSourceAudio(config.names.sources.runner1_169, true).catch(() => { });
        this.toggleSourceAudio(config.names.sources.runner2_169, true).catch(() => { });
        this.toggleSourceAudio(config.names.sources.runner3_169, false).catch(() => { });
        this.toggleSourceAudio(config.names.sources.runner4_169, true).catch(() => { });
        break;
      }
      case 4: {
        await this.changeScene(config.names.scenes._4p169_4);
        this.toggleSourceAudio(config.names.sources.runner1_169, true).catch(() => { });
        this.toggleSourceAudio(config.names.sources.runner2_169, true).catch(() => { });
        this.toggleSourceAudio(config.names.sources.runner3_169, true).catch(() => { });
        this.toggleSourceAudio(config.names.sources.runner4_169, false).catch(() => { });
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
          case 'Grand Theft Auto: Vice City':
            videoFolder = VideoFolder.VC;
            musicFolder = MusicFolder.VC;
            break;
          case 'Grand Theft Auto: San Andreas':
            videoFolder = VideoFolder.SA;
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
          'sourceName': config.names.sources.intermissionVideo,
          'sourceType': 'vlc_source',
          'sourceSettings': {
            'playlist': [{ 'hidden': false, 'selected': false, 'value': config.names.paths.intermissionVideo + '/' + videoFolder }],
            'shuffle': true
          }
        }).catch((err) => {
          nodecg.log.warn('couldnt set video', err);
        });


        // no specific music
        if (!musicFolder) {
          musicFolder = MusicFolder.Mix;
        }
        await this.send('SetSourceSettings', {
          'sourceName': config.names.sources.intermissionMusic,
          'sourceType': 'vlc_source',
          'sourceSettings': {
            'playlist': [{ 'hidden': false, 'selected': false, 'value': config.names.paths.intermissionMusic + '/' + musicFolder }],
            'shuffle': true
          }
        }).catch((err) => {
          nodecg.log.warn('couldnt set music', err);
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
    config.names.audioToMute.forEach((source) => {
      this.toggleSourceAudio(source, true).catch(() => { });
    });
  }

  /**
   * Unmute all audio sources listed in the config.
   */
  async unmuteAudio(): Promise<void> {
    config.names.audioToUnmute.forEach((source) => {
      this.toggleSourceAudio(source, false).catch(() => { });
    });
  }
}

const obs = new OBSUtility();
const settings = {
  address: config.address,
  password: config.password,
};

function connect(): void {
  obs.connect(settings).then(() => {
    nodecg.log.info('OBS connection successful.');
  }).catch((err) => {
    nodecg.log.warn('OBS connection error.');
    nodecg.log.debug('OBS connection error:', err);
  });
}

if (config.enable) {
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
    if (data['sourceName'] == config.names.sources.intermissionVideo) {
      // @ts-ignore: 
      obs.send('SetMediaTime', {
        'sourceName': config.names.sources.intermissionVideo,
        'timestamp': Math.floor(Math.random() * 360000) // random from 0 to 6:00
      }).catch((err) => {
        nodecg.log.warn('couldnt set timestamp', err);
      });
    }
  });

  obs.on('TransitionBegin', (data) => {
    if (data['from-scene'] == config.names.scenes.intermission) {
      setStartHighlight();
    }
  });
}

export default obs;
