import type NodeCG from '@nodecg/types';
import { get } from './nodecg';
import {
  RunData,
  RunDataArray,
  RunFinishTimes,
  Timer,
} from 'speedcontrol/types';
import { HundoTrackerData, GameLayouts } from '@gtam-layouts/types/schemas';
import {
  OengusImportStatus,
  RunDataActiveRunSurrounding,
} from 'speedcontrol/types/schemas';
import {
  SubQueueItem,
  BitsQueueItem,
  MerchQueueItem,
  Asset,
  MediaBoxItem,
} from '@gtam-layouts/types';
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
  'twitchSubQueue',
  { defaultValue: [] }
) as unknown as NodeCG.ServerReplicant<SubQueueItem[]>;
export const twitchBitsQueue = nodecg.Replicant<BitsQueueItem[]>(
  'twitchBitsQueue',
  { defaultValue: [] }
) as unknown as NodeCG.ServerReplicant<BitsQueueItem[]>;
export const merchPurchaseQueue = nodecg.Replicant<MerchQueueItem[]>(
  'merchPurchaseQueue',
  { defaultValue: [] }
) as unknown as NodeCG.ServerReplicant<MerchQueueItem[]>;
export const currentOBSScene = nodecg.Replicant<string>('currentOBSScene', {
  defaultValue: '',
}) as unknown as NodeCG.ServerReplicant<string>;
export const sponsorImages = nodecg.Replicant<Asset[]>(
  'assets:sponsor-logos'
) as unknown as NodeCG.ServerReplicant<Asset[]>;
export const sponsorImagesWidescreen = nodecg.Replicant<Asset[]>(
  'assets:sponsor-logos-widescreen'
) as unknown as NodeCG.ServerReplicant<Asset[]>;
export const merchImages = nodecg.Replicant<Asset[]>(
  'assets:merch-images'
) as unknown as NodeCG.ServerReplicant<Asset[]>;
export const merchImagesWidescreen = nodecg.Replicant<Asset[]>(
  'assets:merch-images-widescreen'
) as unknown as NodeCG.ServerReplicant<Asset[]>;
export const currentMediaBoxItem = nodecg.Replicant<MediaBoxItem>(
  'currentMediaBoxItem'
) as unknown as NodeCG.ServerReplicant<MediaBoxItem>;
