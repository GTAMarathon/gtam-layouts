/* eslint @typescript-eslint/ban-ts-ignore: off */

import obsWebsocketJs from 'obs-websocket-js';
import { Configschema } from '@gtam-layouts/types/schemas';
import { get } from './nodecg';
import { RunData } from '../../../../nodecg-speedcontrol/src/types';
import { RunDataActiveRun } from '../../../../nodecg-speedcontrol/src/types/schemas';
import {
  setStartHighlight,
  setEndAndCreateHighlight,
} from './twitch-highlight';
import {
  runDataActiveRunSurrounding,
  runDataArray,
  runDataActiveRun as activeRun,
  currentOBSScene,
} from './replicants';

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
  V = 'V',
}

enum MusicFolder {
  _2 = '2',
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
const config = nodecg.bundleConfig as Configschema;

// Extending the OBS library with some of our own functions.
class OBSUtility extends obsWebsocketJs {
  /**
   * Change to this OBS scene.
   * @param name Name of the scene.
   */
  async changeScene(name: string): Promise<void> {
    try {
      await this.call('SetCurrentProgramScene', { sceneName: name });
    } catch (err: any) {
      nodecg.log.warn(`Cannot change OBS scene [${name}]: ${err.error}`);
      throw err;
    }
  }

  /**
   * Change to the intermission based on name in config.
   */
  async changeToIntermission(): Promise<void> {
    try {
      this.changeIntermissionVid();
      await new Promise((r) => setTimeout(r, 700));

      await this.changeScene(config.obs.names.scenes.intermission);

      await this.setStudioModeOnTheNextGameScene();
    } catch (err) {
      nodecg.log.warn('error during changeToIntermission', err);
    }
  }

  async setStudioModeOnTheNextGameScene(): Promise<void> {
    let index = runDataArray.value.findIndex(
      (run: RunData) => run.id === runDataActiveRunSurrounding.value.next
    );
    let nextRun = runDataArray.value[index] || null;
    var allScenes = Object.values(config.obs.names.scenes);

    await new Promise((r) => setTimeout(r, 500));

    if (
      nextRun &&
      allScenes &&
      allScenes.includes(nextRun.customData.obsScene)
    ) {
      this.call('GetStudioModeEnabled')
        .then((response) => {
          if (!response.studioModeEnabled) {
            this.call('SetStudioModeEnabled', { studioModeEnabled: true })
              .then(() => {
                this.call('SetCurrentPreviewScene', {
                  sceneName: nextRun.customData.obsScene,
                }).catch((err) => {
                  nodecg.log.warn('StudioMode not enabled', err);
                });
              })
              .catch((err) => {
                nodecg.log.warn('couldnt enable StudioMode', err);
              });
          } else {
            this.call('SetCurrentPreviewScene', {
              sceneName: nextRun.customData.obsScene,
            }).catch((err) => {
              nodecg.log.warn('preview scene not set', err);
            });
          }
        })
        .catch((err) => {
          nodecg.log.warn('couldnt get StudioModeStatus', err);
        });
    }
  }

  async setTwitchUrlToSources(
    twitch: string | undefined,
    sources: (string | undefined)[]
  ): Promise<void> {
    for (var source of sources) {
      if (source && twitch) {
        var url = config.feeds.playerUrl.replace(
          new RegExp('{{twitchAccount}}', 'g'),
          twitch
        );
        await this.call('SetInputSettings', {
          inputName: source,
          inputSettings: { url: url },
        }).catch((err) => {
          nodecg.log.warn('url not set to source', err);
        });
      }
    }
  }

  async changeRunnersOnVCHundo(data: {
    feed1: RunDataActiveRun['teams'][number];
    feed2: RunDataActiveRun['teams'][number];
    feed3: RunDataActiveRun['teams'][number];
    feed4: RunDataActiveRun['teams'][number];
    feed5: RunDataActiveRun['teams'][number];
  }): Promise<void> {
    nodecg.log.warn('data');
    nodecg.log.warn(JSON.stringify(data));

    var index = -1;
    var array = activeRun.value.teams.filter(
      (team) => team.id == data.feed5.id
    );
    if (array.length) {
      index = activeRun.value.teams.indexOf(array[0]);
      if (index > -1) {
        activeRun.value.teams.splice(index, 1);
        activeRun.value.teams.unshift(data.feed5);
        this.setTwitchUrlToSources(
          data.feed5.players[0].social.twitch || undefined,
          [config.obs.names.sources.runner5_43]
        );
      }
    }
    array = activeRun.value.teams.filter((team) => team.id == data.feed4.id);
    if (array.length) {
      index = activeRun.value.teams.indexOf(array[0]);
      if (index > -1) {
        activeRun.value.teams.splice(index, 1);
        activeRun.value.teams.unshift(data.feed4);
        this.setTwitchUrlToSources(
          data.feed4.players[0].social.twitch || undefined,
          [config.obs.names.sources.runner4_43]
        );
      }
    }
    array = activeRun.value.teams.filter((team) => team.id == data.feed3.id);
    if (array.length) {
      index = activeRun.value.teams.indexOf(array[0]);
      if (index > -1) {
        activeRun.value.teams.splice(index, 1);
        activeRun.value.teams.unshift(data.feed3);
        this.setTwitchUrlToSources(
          data.feed3.players[0].social.twitch || undefined,
          [config.obs.names.sources.runner3_43]
        );
      }
    }
    array = activeRun.value.teams.filter((team) => team.id == data.feed2.id);
    if (array.length) {
      index = activeRun.value.teams.indexOf(array[0]);
      if (index > -1) {
        activeRun.value.teams.splice(index, 1);
        activeRun.value.teams.unshift(data.feed2);
        this.setTwitchUrlToSources(
          data.feed2.players[0].social.twitch || undefined,
          [config.obs.names.sources.runner2_43]
        );
      }
    }
    array = activeRun.value.teams.filter((team) => team.id == data.feed1.id);
    if (array.length) {
      index = activeRun.value.teams.indexOf(array[0]);
      if (index > -1) {
        activeRun.value.teams.splice(index, 1);
        activeRun.value.teams.unshift(data.feed1);
        this.setTwitchUrlToSources(
          data.feed1.players[0].social.twitch || undefined,
          [config.obs.names.sources.runner1_43]
        );
      }
    }
  }

  async focusOnRunnerX(runnerNumber: number): Promise<void> {
    switch (runnerNumber) {
      case 1: {
        await this.changeScene(config.obs.names.scenes._4p169_1);
        this.toggleSourceAudio(
          config.obs.names.sources.runner1_169,
          false
        ).catch(() => {});
        this.toggleSourceAudio(
          config.obs.names.sources.runner2_169,
          true
        ).catch(() => {});
        this.toggleSourceAudio(
          config.obs.names.sources.runner3_169,
          true
        ).catch(() => {});
        this.toggleSourceAudio(
          config.obs.names.sources.runner4_169,
          true
        ).catch(() => {});
        break;
      }
      case 2: {
        await this.changeScene(config.obs.names.scenes._4p169_2);
        this.toggleSourceAudio(
          config.obs.names.sources.runner1_169,
          true
        ).catch(() => {});
        this.toggleSourceAudio(
          config.obs.names.sources.runner2_169,
          false
        ).catch(() => {});
        this.toggleSourceAudio(
          config.obs.names.sources.runner3_169,
          true
        ).catch(() => {});
        this.toggleSourceAudio(
          config.obs.names.sources.runner4_169,
          true
        ).catch(() => {});
        break;
      }
      case 3: {
        await this.changeScene(config.obs.names.scenes._4p169_3);
        this.toggleSourceAudio(
          config.obs.names.sources.runner1_169,
          true
        ).catch(() => {});
        this.toggleSourceAudio(
          config.obs.names.sources.runner2_169,
          true
        ).catch(() => {});
        this.toggleSourceAudio(
          config.obs.names.sources.runner3_169,
          false
        ).catch(() => {});
        this.toggleSourceAudio(
          config.obs.names.sources.runner4_169,
          true
        ).catch(() => {});
        break;
      }
      case 4: {
        await this.changeScene(config.obs.names.scenes._4p169_4);
        this.toggleSourceAudio(
          config.obs.names.sources.runner1_169,
          true
        ).catch(() => {});
        this.toggleSourceAudio(
          config.obs.names.sources.runner2_169,
          true
        ).catch(() => {});
        this.toggleSourceAudio(
          config.obs.names.sources.runner3_169,
          true
        ).catch(() => {});
        this.toggleSourceAudio(
          config.obs.names.sources.runner4_169,
          false
        ).catch(() => {});
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
      let index = runDataArray.value.findIndex(
        (run: RunData) => run.id === runDataActiveRunSurrounding.value.next
      );
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

        // set video input
        await this.call('SetInputSettings', {
          inputName: config.obs.names.sources.intermissionVideo,
          inputSettings: {
            playlist: [
              {
                hidden: false,
                selected: false,
                value:
                  config.obs.names.paths.intermissionVideo + '/' + videoFolder,
              },
            ],
            shuffle: true,
          },
        }).catch((err) => {
          nodecg.log.warn("[OBS] Couldn't set intermission video", err);
        });

        // play video to set cursor position
        await this.call('TriggerMediaInputAction', {
          inputName: config.obs.names.sources.intermissionVideo,
          mediaAction: 'OBS_WEBSOCKET_MEDIA_INPUT_ACTION_PLAY',
        }).catch((err) => {
          nodecg.log.warn(
            "[OBS] Couldn't play intermission video for cursor settings purposes: ",
            err
          );
        });

        // randomize video cursor position
        setTimeout(async () => {
          await this.call('SetMediaInputCursor', {
            inputName: config.obs.names.sources.intermissionVideo,
            mediaCursor: Math.floor(Math.random() * 360000), // random from 0 to 6:00
          }).catch((err) => {
            nodecg.log.warn(
              "[OBS] Couldn't set intermission video timestamp",
              err
            );
          });
        }, 200);

        // no specific music
        if (!musicFolder) {
          musicFolder = MusicFolder.Mix;
        }
        await this.call('SetInputSettings', {
          inputName: config.obs.names.sources.intermissionMusic,
          inputSettings: {
            playlist: [
              {
                hidden: false,
                selected: false,
                value:
                  config.obs.names.paths.intermissionMusic + '/' + musicFolder,
              },
            ],
            shuffle: true,
          },
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
      await this.call('SetInputMute', { inputName: source, inputMuted: mute });
    } catch (err: any) {
      nodecg.log.warn(`Cannot mute OBS source [${source}]: ${err.error}`);
      throw err;
    }
  }

  /**
   * Mute all audio sources listed in the config.
   */
  async muteAudio(): Promise<void> {
    config.obs.names.audioToMute.forEach((source) => {
      this.toggleSourceAudio(source, true).catch(() => {});
    });
  }

  /**
   * Unmute all audio sources listed in the config.
   */
  async unmuteAudio(): Promise<void> {
    config.obs.names.audioToUnmute.forEach((source) => {
      this.toggleSourceAudio(source, false).catch(() => {});
    });
  }
}

const obs = new OBSUtility();

function connect(): void {
  obs
    .connect(config.obs.address, config.obs.password)
    .then(() => {
      nodecg.log.info('OBS connection successful.');
    })
    .catch((err) => {
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

  obs.on('ConnectionError', (err) => {
    nodecg.log.warn('OBS connection error.');
    nodecg.log.debug('OBS connection error:', err);
  });

  obs.on('CurrentProgramSceneChanged', (data) => {
    if (data.sceneName != currentOBSScene.value) {
      if (currentOBSScene.value == config.obs.names.scenes.intermission) {
        setStartHighlight();
      }
      currentOBSScene.value = data.sceneName;
    }
  });
}

export default obs;
