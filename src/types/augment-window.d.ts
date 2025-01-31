/**
 * This is a modified version of the augment-window.d.ts file included in
 * the NodeCG types, but allows us to automatically receive the configuration types.
 */

import type NodeCG from 'nodecg/types'
import type { Configschema } from './'

type ncgClientAPI = NodeCG.ClientAPI<Configschema>

declare global {
  let NodeCG: ncgClientAPI
  let nodecg: ncgClientAPI
}
