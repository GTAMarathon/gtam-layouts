import { Configschema } from '@gtam-layouts/types/schemas';
import obsWebsocketJs from 'obs-websocket-js';
import { get } from './nodecg';

const nodecg = get();
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
      await this.changeScene(config.names.scenes.intermission);
    } catch (err) {
      // err
    }
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
      this.toggleSourceAudio(source, true).catch(() => {});
    });
  }

  /**
   * Unmute all audio sources listed in the config.
   */
  async unmuteAudio(): Promise<void> {
    config.names.audioToUnmute.forEach((source) => {
      this.toggleSourceAudio(source, false).catch(() => {});
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Pretty sure this emits an error.
  obs.on('error', (err) => {
    nodecg.log.warn('OBS connection error.');
    nodecg.log.debug('OBS connection error:', err);
  });
}

export default obs;
