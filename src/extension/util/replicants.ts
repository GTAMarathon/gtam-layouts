import type {
  Asset,
  BitsQueueItem,
  GameLayouts,
  HundoTrackerData,
  MediaBoxItem,
  MerchQueueItem,
  SubQueueItem,
} from '@gtam-layouts/types'
import type {
  RunData,
  RunDataArray,
  RunFinishTimes,
  Timer,
} from 'speedcontrol/types'
import type {
  OengusImportStatus,
  RunDataActiveRunSurrounding,
} from 'speedcontrol/types/schemas'
import type { DonationGoal, TiltifyDonation, TiltifyTokenData } from '../../types/custom/Tiltify-Types'
import { get } from './nodecg'

const nodecg = get()

export const timer = nodecg.Replicant<Timer>(
  'timer',
  'nodecg-speedcontrol',
)
export const runDataActiveRun = nodecg.Replicant<RunData>(
  'runDataActiveRun',
  'nodecg-speedcontrol',
)
export const hundoTrackerData = nodecg.Replicant<HundoTrackerData>(
  'hundoTrackerData',
  { defaultValue: [] },
)
export const runDataActiveRunSurrounding
  = nodecg.Replicant<RunDataActiveRunSurrounding>(
    'runDataActiveRunSurrounding',
    'nodecg-speedcontrol',
  )
export const runFinishTimes = nodecg.Replicant<RunFinishTimes>(
  'runFinishTimes',
  'nodecg-speedcontrol',
)
export const oengusImportStatus = nodecg.Replicant<OengusImportStatus>(
  'oengusImportStatus',
  'nodecg-speedcontrol',
)
export const runDataArray = nodecg.Replicant<RunDataArray>(
  'runDataArray',
  'nodecg-speedcontrol',
)
export const gameLayouts = nodecg.Replicant<GameLayouts>(
  'gameLayouts',
)
export const twitchSubQueue = nodecg.Replicant<SubQueueItem[]>(
  'twitchSubQueue',
  { defaultValue: [] },
)
export const twitchBitsQueue = nodecg.Replicant<BitsQueueItem[]>(
  'twitchBitsQueue',
  { defaultValue: [] },
)
export const merchPurchaseQueue = nodecg.Replicant<MerchQueueItem[]>(
  'merchPurchaseQueue',
  { defaultValue: [] },
)
export const currentOBSScene = nodecg.Replicant<string>('currentOBSScene', {
  defaultValue: '',
})
export const sponsorImages = nodecg.Replicant<Asset[]>(
  'assets:sponsor-logos',
)
export const sponsorImagesWidescreen = nodecg.Replicant<Asset[]>(
  'assets:sponsor-logos-widescreen',
)
export const merchImages = nodecg.Replicant<Asset[]>(
  'assets:merch-images',
)
export const merchImagesWidescreen = nodecg.Replicant<Asset[]>(
  'assets:merch-images-widescreen',
)
export const currentMediaBoxItem = nodecg.Replicant<MediaBoxItem>(
  'currentMediaBoxItem',
)
export const currentGameLayout = nodecg.Replicant<string>(
  'currentGameLayout',
)

export const donationTotal = nodecg.Replicant<number>(
  'donationTotal',
  { defaultValue: 0, persistent: false },
)

export const donationGoals = nodecg.Replicant<DonationGoal[]>(
  'donationGoals',
  { defaultValue: [], persistent: false },
)

export const tiltifyTokens = nodecg.Replicant<TiltifyTokenData>(
  'tiltifyTokens',
  {
    persistent: true,
    defaultValue: {
      access_token: '',
      expires_at: new Date(0),
    },
  },
)

export const donationsToShow = nodecg.Replicant<TiltifyDonation[]>(
  'donationsToShow',
  { defaultValue: [], persistent: false },
)

export const donationsShown = nodecg.Replicant<string[]>(
  'donationsShown',
  { defaultValue: [], persistent: true },
)

export const recentDonations = nodecg.Replicant<TiltifyDonation[]>(
  'recentDonations',
  {
    defaultValue: [],
    persistent: false,
  },
)
