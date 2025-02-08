/**
 * This is a modified version of the augment-window.d.ts file included in
 * the NodeCG types, but allows us to automatically receive the configuration types.
 */

import type { NodeCGAPIClient } from 'node_modules/nodecg/out/client/api/api.client'
import type NodeCG from 'nodecg/types'
import type { Configschema } from './'

type ncgClientAPI = NodeCG.ClientAPI<Configschema>

declare global {
  let NodeCG: typeof NodeCGAPIClient
  let nodecg: ncgClientAPI
}
