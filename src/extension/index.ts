/* eslint global-require: off */

import { NodeCG } from 'nodecg/types/server'; // eslint-disable-line import/no-unresolved
import { set } from './util/nodecg';

export = (nodecg: NodeCG): void => {
  set(nodecg);
  require('./util/obs'); // Make sure OBS connection is setup.
  require('./util/twitch-highlight');
  /* require('./tracker'); */
  require('./layouts');
  require('./featured');
  require('./pollsandpredictions');
};
