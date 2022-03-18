/* eslint-disable max-len */

import type { DonationTotal, Host } from '@gtam-layouts/types/schemas';
import { get as nodecg } from './nodecg';

/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */

export const donationTotal = nodecg().Replicant<DonationTotal>('donationTotal');
export const host = nodecg().Replicant<Host>('host');
