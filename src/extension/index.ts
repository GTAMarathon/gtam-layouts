/* eslint global-require: off */

import type NodeCG from '@nodecg/types'; // eslint-disable-line import/no-unresolved
import { set } from './util/nodecg';
import { Configschema } from '@gtam-layouts/types/schemas';

export = (nodecg: NodeCG.ServerAPI<Configschema>): void => {
  set(nodecg);
  require('./util/obs'); // Make sure OBS connection is setup.
  require('./util/twitch-highlight');
  /* require('./tracker'); */
  require('./layouts');
  require('./featured');
  require('./pollsandpredictions');
  require('./hundo');
};
