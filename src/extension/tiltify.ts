import type { Configschema } from '../types/generated/configschema'
import { get } from '../extension/util/nodecg'
import { donationGoals, donationQueue, donationTotal, processedDonations } from '../extension/util/replicants'
import { TiltifyClient } from './util/tiltify-client'

const nodecg = get()
const config = (nodecg.bundleConfig as Configschema).tiltify
const updateIntervals: NodeJS.Timeout[] = []

if (config?.enable) {
  if (!config.clientId || !config.clientSecret || !config.campaign) {
    nodecg.log.error('[Tiltify] Missing required configuration values')
  }
  else {
    initializeTiltify().catch((error) => {
      nodecg.log.error('[Tiltify] Initialization failed:', error)
    })
  }
}

/**
 * Initializes the Tiltify client and intervals.
 */
async function initializeTiltify(): Promise<void> {
  try {
    const client = new TiltifyClient()

    // Initial fetch
    await updateDonationTotal(client)
    await updateMilestones(client)
    await updateRecentDonations(client)

    // Setup intervals
    const totalInterval = setInterval(() => updateDonationTotal(client), 15000)
    const goalsInterval = setInterval(() => updateMilestones(client), 1800000)
    const donationsInterval = setInterval(() => updateRecentDonations(client), 300000)

    updateIntervals.push(totalInterval, goalsInterval, donationsInterval)

    nodecg.log.info('[Tiltify] Integration initialized successfully')
  }
  catch (error) {
    nodecg.log.error('[Tiltify] Initialization failed:', error)
  }
}

/**
 * Updates the amount of money raised.
 * @param client The client to update donationtotal for.
 */
async function updateDonationTotal(client: TiltifyClient): Promise<void> {
  try {
    nodecg.log.debug('[Tiltify] Updating donation total')
    const total = await client.fetchCampaignTotal()
    if (donationTotal.value !== total) {
      donationTotal.value = total
    }
  }
  catch (error) {
    nodecg.log.error('[Tiltify] Failed to update donation total:', error)
  }
}

/**
 * Updates milestones for the event.
 * @param client The client to update milestones for.
 */
async function updateMilestones(client: TiltifyClient): Promise<void> {
  try {
    nodecg.log.debug('[Tiltify] Updating Milestones total')
    const milestones = await client.fetchMilestones()
    donationGoals.value = milestones.map(m => ({
      name: m.name,
      amount: Number.parseFloat(m.amount.value),
    }))
  }
  catch (error) {
    nodecg.log.error('[Tiltify] Failed to update milestones:', error)
  }
}

/**
 * Updates recent donations.
 * @param client The client to update donations for.
 */
async function updateRecentDonations(client: TiltifyClient): Promise<void> {
  try {
    const donations = await client.fetchRecentDonations(5)
    const newDonations = donations.filter(d =>
      !processedDonations.value.includes(d.id),
    )

    if (newDonations.length > 0) {
      donationQueue.value = [
        ...newDonations.reverse(),
        ...donationQueue.value,
      ]

      processedDonations.value = [
        ...newDonations.map(d => d.id),
        ...processedDonations.value,
      ].slice(0, 100)
    }
  }
  catch (error) {
    nodecg.log.error('[Tiltify] Failed to update recent donations:', error)
  }
}
