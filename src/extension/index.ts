/* eslint-disable global-require */

// This must go first so we can use module aliases!
/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('module-alias').addAlias(
  '@gtam-layouts',
  require('path').join(__dirname, '.')
);

import type NodeCG from '@nodecg/types';
import { set } from './util/nodecg';
import { Configschema } from '@gtam-layouts/types/schemas';

export = (nodecg: NodeCG.ServerAPI<Configschema>): void => {
  /**
   * Because of how `import`s work, it helps to use `require`s to force
   * things to be loaded *after* the NodeCG context is set.
   */
  set(nodecg);
  require('./util/obs'); // Make sure OBS connection is setup.
  require('./util/twitch-highlight');
  require('./layouts');
  require('./featured');
  require('./pollsandpredictions');
  require('./hundo');
  require('./streamelements');
};
