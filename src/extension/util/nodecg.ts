import type NodeCG from '@nodecg/types'; // eslint-disable-line import/no-unresolved
import { Configschema } from '@gtam-layouts/types/schemas';

let nodecg: NodeCG.ServerAPI<Configschema>;

export function set(ctx: NodeCG.ServerAPI<Configschema>): void {
  nodecg = ctx;
}

export function get(): NodeCG.ServerAPI<Configschema> {
  return nodecg;
}
