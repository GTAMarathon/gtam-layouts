import type NodeCG from '@nodecg/types';
import { get } from './nodecg';
import {
  RunData,
  RunDataArray,
  RunFinishTimes,
  Timer,
} from '../../../../nodecg-speedcontrol/src/types';
import { HundoTrackerData, GameLayouts } from '@gtam-layouts/types/schemas';
import {
  OengusImportStatus,
  RunDataActiveRunSurrounding,
} from '../../../../nodecg-speedcontrol/src/types/schemas';
import { SubQueueItem, BitsQueueItem, MerchQueueItem } from '@gtam-layouts/types';
const nodecg = get();

export const timer = nodecg.Replicant<Timer>(
  'timer',
  'nodecg-speedcontrol'
) as unknown as NodeCG.ServerReplicantWithSchemaDefault<Timer>;
export const runDataActiveRun = nodecg.Replicant<RunData>(
  'runDataActiveRun',
  'nodecg-speedcontrol'
) as unknown as NodeCG.ServerReplicantWithSchemaDefault<RunData>;
export const hundoTrackerData = nodecg.Replicant<HundoTrackerData>(
  'hundoTrackerData',
  { defaultValue: [] }
) as unknown as NodeCG.ServerReplicant<HundoTrackerData>;
export const runDataActiveRunSurrounding =
  nodecg.Replicant<RunDataActiveRunSurrounding>(
    'runDataActiveRunSurrounding',
    'nodecg-speedcontrol'
  ) as unknown as NodeCG.ServerReplicantWithSchemaDefault<RunDataActiveRunSurrounding>;
export const runFinishTimes = nodecg.Replicant<RunFinishTimes>(
  'runFinishTimes',
  'nodecg-speedcontrol'
) as unknown as NodeCG.ServerReplicantWithSchemaDefault<RunFinishTimes>;
export const oengusImportStatus = nodecg.Replicant<OengusImportStatus>(
  'oengusImportStatus',
  'nodecg-speedcontrol'
) as unknown as NodeCG.ServerReplicantWithSchemaDefault<OengusImportStatus>;
export const runDataArray = nodecg.Replicant<RunDataArray>(
  'runDataArray',
  'nodecg-speedcontrol'
) as unknown as NodeCG.ServerReplicantWithSchemaDefault<RunDataArray>;
export const gameLayouts = nodecg.Replicant<GameLayouts>(
  'gameLayouts'
) as unknown as NodeCG.ServerReplicantWithSchemaDefault<GameLayouts>;
export const twitchSubQueue = nodecg.Replicant<SubQueueItem[]>(
  'twitchSubQueue'
) as unknown as NodeCG.ServerReplicant<SubQueueItem[]>;
export const twitchBitsQueue = nodecg.Replicant<BitsQueueItem[]>(
  'twitchBitsQueue'
) as unknown as NodeCG.ServerReplicant<BitsQueueItem[]>;
export const merchPurchaseQueue = nodecg.Replicant<MerchQueueItem[]>(
  'merchPurchaseQueue'
) as unknown as NodeCG.ServerReplicant<MerchQueueItem[]>;
