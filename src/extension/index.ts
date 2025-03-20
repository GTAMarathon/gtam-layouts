import type { Configschema } from '@gtam-layouts/types/generated/configschema'
import type NodeCG from 'nodecg/types'
import { set } from './util/nodecg'

require('module-alias').addAlias('@gtam-layouts', require('node:path').join(__dirname, '.'))

export = (nodecg: NodeCG.ServerAPI<Configschema>) => {
  set(nodecg)
  require('./hundo')
  require('./media-box')
  require('./scheduling')
  require('./layouts')
  require('./pollsAndPredictions')
  require('./streamelements')
}
