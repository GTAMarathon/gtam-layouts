/* eslint @typescript-eslint/ban-ts-ignore: off */

import obsWebsocketJs from 'obs-websocket-js';
import { Configschema } from '@gtam-layouts/types/schemas';
import { TransformProperties } from '@gtam-layouts/types';
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

interface GameLayoutSceneItemIds {
  bingoBoard: number | undefined;
  feed1: number | undefined;
  feed2: number | undefined;
  feed3: number | undefined;
  feed4: number | undefined;
}

const nodecg = get();
const config = nodecg.bundleConfig as Configschema;

// Extending the OBS library with some of our own functions.
class OBSUtility extends obsWebsocketJs {
  connected = false;
  currentScene = '';

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

  /** Get IDs of the items on the game scene. */
  async getGameLayoutSceneItemIds(): Promise<GameLayoutSceneItemIds> {
    const gameLayoutScene = config.obs.names.scenes.gameLayout;
    let ids: GameLayoutSceneItemIds = {
      bingoBoard: undefined,
      feed1: undefined,
      feed2: undefined,
      feed3: undefined,
      feed4: undefined,
    };
    await this.call('GetSceneItemId', {
      sceneName: config.obs.names.scenes.gameLayout,
      sourceName: config.obs.names.sources.bingoBoard,
    })
      .then((data) => {
        ids.bingoBoard = data.sceneItemId;
      })
      .catch((err) => {
        nodecg.log.warn("[OBS] Couldn't get the ID for the bingo board: ", err);
      });

    await this.call('GetSceneItemId', {
      sceneName: gameLayoutScene,
      sourceName: config.obs.names.sources.runner1,
    })
      .then((data) => {
        ids.feed1 = data.sceneItemId;
      })
      .catch((err) => {
        nodecg.log.warn(
          "[OBS] Couldn't get the ID for the runner 1 feed: ",
          err
        );
      });

    await this.call('GetSceneItemId', {
      sceneName: gameLayoutScene,
      sourceName: config.obs.names.sources.runner2,
    })
      .then((data) => {
        ids.feed2 = data.sceneItemId;
      })
      .catch((err) => {
        nodecg.log.warn(
          "[OBS] Couldn't get the ID for the runner 2 feed: ",
          err
        );
      });
    await this.call('GetSceneItemId', {
      sceneName: gameLayoutScene,
      sourceName: config.obs.names.sources.runner3,
    })
      .then((data) => {
        ids.feed3 = data.sceneItemId;
      })
      .catch((err) => {
        nodecg.log.warn(
          "[OBS] Couldn't get the ID for the runner 3 feed: ",
          err
        );
      });

    await this.call('GetSceneItemId', {
      sceneName: gameLayoutScene,
      sourceName: config.obs.names.sources.runner4,
    })
      .then((data) => {
        ids.feed4 = data.sceneItemId;
      })
      .catch((err) => {
        nodecg.log.warn(
          "[OBS] Couldn't get the ID for the runner 4 feed: ",
          err
        );
      });

    return ids;
  }

  /**
   * Change to the intermission based on name in config.
   */
  async changeToIntermission(): Promise<void> {
    try {
      await this.changeIntermissionVid();
      await new Promise((r) => setTimeout(r, 80));

      await this.changeScene(config.obs.names.scenes.intermission);

      await this.setStudioModeOnTheNextGameScene();
    } catch (err) {
      nodecg.log.warn('error during changeToIntermission', err);
    }
  }

  /**
   * Sets the layout and sets up required sources for the provided one.
   * @param layout Name of the layout to change to
   */
  async setGameLayout(layout: string): Promise<void> {
    const sceneItemIds = await this.getGameLayoutSceneItemIds();
    const gameLayout = config.obs.names.scenes.gameLayout;
    // Set used audio to feed 1
    this.muteAudio().catch(() => {});
    this.unmuteAudio().catch(() => {});
    switch (layout) {
      case '3x2-1p':
        // (Un)hide not required sources, and set the transform properties where required
        if (sceneItemIds.feed1) {
          // Need to set the width/height in the browser source settings too
          await this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner1,
            inputSettings: { width: 1440, height: 960 },
          });
          // Make the feed visible
          await this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed1,
            true
          ).catch(() => {});
          // Set the feed's transform properties
          await this.setSceneItemTransform(gameLayout, sceneItemIds.feed1, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 960,
            positionX: 480,
            positionY: 60,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 960,
            sourceWidth: 1440,
            width: 1440,
          }).catch(() => {});
        }

        if (sceneItemIds.feed2) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed2,
            false
          ).catch(() => {});
        }

        if (sceneItemIds.feed3) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed3,
            false
          ).catch(() => {});
        }

        if (sceneItemIds.feed4) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed4,
            false
          ).catch(() => {});
        }

        if (sceneItemIds.bingoBoard) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.bingoBoard,
            false
          ).catch(() => {});
        }
        break;
      case '4x3-1p':
        // (Un)hide not required sources, and set the transform properties where required
        if (sceneItemIds.feed1) {
          // Need to set the width/height in the browser source settings too
          await this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner1,
            inputSettings: { width: 1440, height: 1080 },
          });
          // Make the feed visible
          await this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed1,
            true
          ).catch(() => {});
          // Set the feed's transform properties
          await this.setSceneItemTransform(gameLayout, sceneItemIds.feed1, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 1080,
            positionX: 480,
            positionY: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 1080,
            sourceWidth: 1440,
            width: 1440,
          }).catch(() => {});
        }

        if (sceneItemIds.feed2) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed2,
            false
          ).catch(() => {});
        }

        if (sceneItemIds.feed3) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed3,
            false
          ).catch(() => {});
        }

        if (sceneItemIds.feed4) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed4,
            false
          ).catch(() => {});
        }

        if (sceneItemIds.bingoBoard) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.bingoBoard,
            false
          ).catch(() => {});
        }
        break;
      case '4x3-2p':
        if (sceneItemIds.feed1) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed1,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner1,
            inputSettings: { width: 960, height: 720 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed1, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 720,
            positionX: 0,
            positionY: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 720,
            sourceWidth: 960,
            width: 960,
          }).catch(() => {});
        }

        if (sceneItemIds.feed2) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed2,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner2,
            inputSettings: { width: 960, height: 720 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed2, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 720,
            positionX: 960,
            positionY: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 720,
            sourceWidth: 960,
            width: 960,
          }).catch(() => {});
        }

        if (sceneItemIds.feed3) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed3,
            false
          ).catch(() => {});
        }

        if (sceneItemIds.feed4) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed4,
            false
          ).catch(() => {});
        }

        if (sceneItemIds.bingoBoard) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.bingoBoard,
            false
          ).catch(() => {});
        }
        break;
      case '4x3-3p':
        if (sceneItemIds.feed1) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed1,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner1,
            inputSettings: { width: 721, height: 541 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed1, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 541,
            positionX: 0,
            positionY: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 541,
            sourceWidth: 721,
            width: 721,
          }).catch(() => {});
        }

        if (sceneItemIds.feed2) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed2,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner2,
            inputSettings: { width: 721, height: 540 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed2, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 540,
            positionX: 593,
            positionY: 540,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 540,
            sourceWidth: 721,
            width: 721,
          }).catch(() => {});
        }

        if (sceneItemIds.feed3) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed3,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner3,
            inputSettings: { width: 721, height: 541 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed3, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 541,
            positionX: 1198,
            positionY: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 541,
            sourceWidth: 721,
            width: 721,
          }).catch(() => {});
        }

        if (sceneItemIds.feed4) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed4,
            false
          ).catch(() => {});
        }

        if (sceneItemIds.bingoBoard) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.bingoBoard,
            false
          ).catch(() => {});
        }
        break;
      case '4x3-4p':
        if (sceneItemIds.feed1) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed1,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner1,
            inputSettings: { width: 614, height: 461 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed1, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 461,
            positionX: 0,
            positionY: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 461,
            sourceWidth: 614,
            width: 614,
          }).catch(() => {});
        }

        if (sceneItemIds.feed2) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed2,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner2,
            inputSettings: { width: 614, height: 461 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed2, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 461,
            positionX: 1306,
            positionY: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 461,
            sourceWidth: 614,
            width: 614,
          }).catch(() => {});
        }

        if (sceneItemIds.feed3) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed3,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner3,
            inputSettings: { width: 614, height: 461 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed3, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 461,
            positionX: 0,
            positionY: 540,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 461,
            sourceWidth: 614,
            width: 614,
          }).catch(() => {});
        }

        if (sceneItemIds.feed4) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed4,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner4,
            inputSettings: { width: 614, height: 461 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed4, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 461,
            positionX: 1306,
            positionY: 540,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 461,
            sourceWidth: 614,
            width: 614,
          }).catch(() => {});
        }

        if (sceneItemIds.bingoBoard) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.bingoBoard,
            false
          ).catch(() => {});
        }
        break;
      case '16x9-1p':
        // (Un)hide not required sources, and set the transform properties where required
        if (sceneItemIds.feed1) {
          // Need to set the width/height in the browser source settings too
          await this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner1,
            inputSettings: { width: 1536, height: 864 },
          });
          // Make the feed visible
          await this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed1,
            true
          ).catch(() => {});
          // Set the feed's transform properties
          await this.setSceneItemTransform(gameLayout, sceneItemIds.feed1, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 864,
            positionX: 384,
            positionY: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 864,
            sourceWidth: 1536,
            width: 1536,
          }).catch(() => {});
        }

        if (sceneItemIds.feed2) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed2,
            false
          ).catch(() => {});
        }

        if (sceneItemIds.feed3) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed3,
            false
          ).catch(() => {});
        }

        if (sceneItemIds.feed4) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed4,
            false
          ).catch(() => {});
        }

        if (sceneItemIds.bingoBoard) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.bingoBoard,
            false
          ).catch(() => {});
        }
        break;
      case '16x9-2p':
        if (sceneItemIds.feed1) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed1,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner1,
            inputSettings: { width: 960, height: 540 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed1, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 540,
            positionX: 0,
            positionY: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 540,
            sourceWidth: 960,
            width: 960,
          }).catch(() => {});
        }

        if (sceneItemIds.feed2) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed2,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner2,
            inputSettings: { width: 960, height: 540 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed2, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 540,
            positionX: 960,
            positionY: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 540,
            sourceWidth: 960,
            width: 960,
          }).catch(() => {});
        }

        if (sceneItemIds.feed3) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed3,
            false
          ).catch(() => {});
        }

        if (sceneItemIds.feed4) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed4,
            false
          ).catch(() => {});
        }

        if (sceneItemIds.bingoBoard) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.bingoBoard,
            false
          ).catch(() => {});
        }
        break;
      case '16x9-3p':
        if (sceneItemIds.feed1) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed1,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner1,
            inputSettings: { width: 768, height: 432 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed1, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 432,
            positionX: 0,
            positionY: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 432,
            sourceWidth: 768,
            width: 768,
          }).catch(() => {});
        }

        if (sceneItemIds.feed2) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed2,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner2,
            inputSettings: { width: 768, height: 432 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed2, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 432,
            positionX: 1152,
            positionY: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 432,
            sourceWidth: 768,
            width: 768,
          }).catch(() => {});
        }

        if (sceneItemIds.feed3) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed3,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner3,
            inputSettings: { width: 768, height: 432 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed3, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 432,
            positionX: 576,
            positionY: 432,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 432,
            sourceWidth: 768,
            width: 768,
          }).catch(() => {});
        }

        if (sceneItemIds.feed4) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed4,
            false
          ).catch(() => {});
        }

        if (sceneItemIds.bingoBoard) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.bingoBoard,
            false
          ).catch(() => {});
        }
        break;
      case '16x9-4p':
        if (sceneItemIds.feed1) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed1,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner1,
            inputSettings: { width: 768, height: 432 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed1, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 432,
            positionX: 0,
            positionY: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 432,
            sourceWidth: 768,
            width: 768,
          }).catch(() => {});
        }

        if (sceneItemIds.feed2) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed2,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner2,
            inputSettings: { width: 768, height: 432 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed2, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 432,
            positionX: 1152,
            positionY: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 432,
            sourceWidth: 768,
            width: 768,
          }).catch(() => {});
        }

        if (sceneItemIds.feed3) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed3,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner3,
            inputSettings: { width: 768, height: 432 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed3, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 432,
            positionX: 0,
            positionY: 540,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 432,
            sourceWidth: 768,
            width: 768,
          }).catch(() => {});
        }

        if (sceneItemIds.feed4) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed4,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner4,
            inputSettings: { width: 768, height: 432 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed4, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 432,
            positionX: 1152,
            positionY: 540,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 432,
            sourceWidth: 768,
            width: 768,
          }).catch(() => {});
        }

        if (sceneItemIds.bingoBoard) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.bingoBoard,
            false
          ).catch(() => {});
        }
        break;
      case '4x3-bingo':
        if (sceneItemIds.feed1) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed1,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner1,
            inputSettings: { width: 614, height: 461 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed1, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 461,
            positionX: 0,
            positionY: 4,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 461,
            sourceWidth: 614,
            width: 614,
          }).catch(() => {});
        }

        if (sceneItemIds.feed2) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed2,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner2,
            inputSettings: { width: 614, height: 461 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed2, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 461,
            positionX: 1306,
            positionY: 4,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 461,
            sourceWidth: 614,
            width: 614,
          }).catch(() => {});
        }

        if (sceneItemIds.feed3) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed3,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner3,
            inputSettings: { width: 614, height: 461 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed3, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 461,
            positionX: 0,
            positionY: 540,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 461,
            sourceWidth: 614,
            width: 614,
          }).catch(() => {});
        }

        if (sceneItemIds.feed4) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed4,
            false
          ).catch(() => {});
        }

        if (sceneItemIds.bingoBoard) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.bingoBoard,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.bingoBoard,
            inputSettings: { width: 614, height: 540 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.bingoBoard, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 540,
            positionX: 1306,
            positionY: 540,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 540,
            sourceWidth: 614,
            width: 614,
          }).catch(() => {});
        }
        break;
      case '16x9-bingo':
        if (sceneItemIds.feed1) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed1,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner1,
            inputSettings: { width: 768, height: 432 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed1, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 432,
            positionX: 0,
            positionY: 5,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 432,
            sourceWidth: 768,
            width: 768,
          }).catch(() => {});
        }

        if (sceneItemIds.feed2) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed2,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner2,
            inputSettings: { width: 768, height: 432 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed2, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 432,
            positionX: 1152,
            positionY: 5,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 432,
            sourceWidth: 768,
            width: 768,
          }).catch(() => {});
        }

        if (sceneItemIds.feed3) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed3,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.runner3,
            inputSettings: { width: 768, height: 432 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.feed3, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 432,
            positionX: 0,
            positionY: 545,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 432,
            sourceWidth: 768,
            width: 768,
          }).catch(() => {});
        }

        if (sceneItemIds.feed4) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.feed4,
            false
          ).catch(() => {});
        }

        if (sceneItemIds.bingoBoard) {
          this.toggleSourceVisibility(
            gameLayout,
            sceneItemIds.bingoBoard,
            true
          ).catch(() => {});
          this.call('SetInputSettings', {
            inputName: config.obs.names.sources.bingoBoard,
            inputSettings: { width: 768, height: 540 },
          });
          this.setSceneItemTransform(gameLayout, sceneItemIds.bingoBoard, {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1,
            boundsType: 'OBS_BOUNDS_NONE',
            boundsWidth: 1,
            cropBottom: 0,
            cropLeft: 0,
            cropRight: 0,
            cropTop: 0,
            height: 540,
            positionX: 1152,
            positionY: 540,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            sourceHeight: 540,
            sourceWidth: 768,
            width: 768,
          }).catch(() => {});
        }
        break;
      default:
        // If for some catastrophical reason there's no layout passed, rerun the function with the 4:3 1 player option
        this.setGameLayout('4x3-1p');
        break;
    }
  }

  async updateBingoBoardURL(url: string): Promise<void> {
    if (url) {
      await this.call('SetInputSettings', {
        inputName: config.obs.names.sources.bingoBoard,
        inputSettings: { url: url },
      }).catch((err) => {
        nodecg.log.warn('[OBS] Failed to set bingo board URL: ', err);
      });
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
      allScenes.includes(config.obs.names.scenes.gameLayout)
    ) {
      this.call('GetStudioModeEnabled')
        .then((response) => {
          if (!response.studioModeEnabled) {
            this.call('SetStudioModeEnabled', { studioModeEnabled: true })
              .then(() => {
                this.call('SetCurrentPreviewScene', {
                  sceneName: config.obs.names.scenes.gameLayout,
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
          [config.obs.names.sources.runner5]
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
          [config.obs.names.sources.runner4]
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
          [config.obs.names.sources.runner3]
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
          [config.obs.names.sources.runner2]
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
          [config.obs.names.sources.runner1]
        );
      }
    }
  }

  async focusOnRunnerX(runnerNumber: number): Promise<void> {
    switch (runnerNumber) {
      case 1: {
        await this.changeScene(config.obs.names.scenes.gameLayout);
        this.toggleSourceAudio(config.obs.names.sources.runner1, false).catch(
          () => {}
        );
        this.toggleSourceAudio(config.obs.names.sources.runner2, true).catch(
          () => {}
        );
        this.toggleSourceAudio(config.obs.names.sources.runner3, true).catch(
          () => {}
        );
        this.toggleSourceAudio(config.obs.names.sources.runner4, true).catch(
          () => {}
        );
        break;
      }
      case 2: {
        await this.changeScene(config.obs.names.scenes.gameLayout);
        this.toggleSourceAudio(config.obs.names.sources.runner1, true).catch(
          () => {}
        );
        this.toggleSourceAudio(config.obs.names.sources.runner2, false).catch(
          () => {}
        );
        this.toggleSourceAudio(config.obs.names.sources.runner3, true).catch(
          () => {}
        );
        this.toggleSourceAudio(config.obs.names.sources.runner4, true).catch(
          () => {}
        );
        break;
      }
      case 3: {
        await this.changeScene(config.obs.names.scenes.gameLayout);
        this.toggleSourceAudio(config.obs.names.sources.runner1, true).catch(
          () => {}
        );
        this.toggleSourceAudio(config.obs.names.sources.runner2, true).catch(
          () => {}
        );
        this.toggleSourceAudio(config.obs.names.sources.runner3, false).catch(
          () => {}
        );
        this.toggleSourceAudio(config.obs.names.sources.runner4, true).catch(
          () => {}
        );
        break;
      }
      case 4: {
        await this.changeScene(config.obs.names.scenes.gameLayout);
        this.toggleSourceAudio(config.obs.names.sources.runner1, true).catch(
          () => {}
        );
        this.toggleSourceAudio(config.obs.names.sources.runner2, true).catch(
          () => {}
        );
        this.toggleSourceAudio(config.obs.names.sources.runner3, true).catch(
          () => {}
        );
        this.toggleSourceAudio(config.obs.names.sources.runner4, false).catch(
          () => {}
        );
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
   * Hide or unhide the provided OBS source.
   * @param scene Name of the scene the source is in.
   * @param sourceId Scene Item ID of the source.
   * @param visible Is the source going to be visible?
   */
  async toggleSourceVisibility(
    scene: string,
    sourceId: number,
    visible = true
  ): Promise<void> {
    try {
      await this.call('SetSceneItemEnabled', {
        sceneName: scene,
        sceneItemId: sourceId,
        sceneItemEnabled: visible,
      });
    } catch (err: any) {
      nodecg.log.warn(`Cannot (un)hide OBS source [${sourceId}]: ${err.error}`);
      throw err;
    }
  }

  /**
   * Set transform properties of a specific scene item.
   * @param scene Name of the scene the source is in.
   * @param sourceId Scene Item ID of the source.
   * @param sourceTransform Transform properties to apply to the source.
   */
  async setSceneItemTransform(
    scene: string,
    sourceId: number,
    sourceTransform: TransformProperties
  ): Promise<void> {
    try {
      await this.call('SetSceneItemTransform', {
        sceneName: scene,
        sceneItemId: sourceId,
        sceneItemTransform: sourceTransform,
      });
    } catch (err: any) {
      nodecg.log.warn(
        `Cannot set source transform properties [${sourceId}]: ${err.error}`
      );
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
      obs.connected = true;
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
    obs.connected = false;
    nodecg.log.warn('OBS connection lost, retrying in 5 seconds.');
    setTimeout(connect, 5000);
  });

  obs.on('ConnectionError', (err) => {
    obs.connected = false;
    nodecg.log.warn('OBS connection error.');
    nodecg.log.debug('OBS connection error:', err);
  });

  obs.on('CurrentProgramSceneChanged', (data) => {
    if (data.sceneName != obs.currentScene) {
      if (obs.currentScene == config.obs.names.scenes.intermission) {
        setStartHighlight();
      }
      obs.currentScene = data.sceneName;
    }
  });
}

export default obs;
