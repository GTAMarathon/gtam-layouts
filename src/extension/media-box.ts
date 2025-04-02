import {
  currentMediaBoxItem,
  donationQueue,
  merchImages,
  merchImagesWidescreen,
  merchPurchaseQueue,
  sponsorImages,
  sponsorImagesWidescreen,
  twitchBitsQueue,
  twitchSubQueue,
} from '@gtam-layouts/util/replicants'
import { klona as clone } from 'klona/json'
import { get } from '../extension/util/nodecg'

type MediaBoxStages = 'MerchImage' | 'SponsorImage'
const nodecg = get()

let sponsorIndex = 0
let merchIndex = 0
let lastStage: MediaBoxStages = 'MerchImage'
let timeout: NodeJS.Timeout

function setNextMediaBoxItem(): void {
  const isDonationQueued = donationQueue.value && donationQueue.value.length > 0
  const isTwitchSubQueued = twitchSubQueue.value && twitchSubQueue.value.length > 0
  const isTwitchBitsQueued = twitchBitsQueue.value && twitchBitsQueue.value.length > 0
  const isMerchQueued = merchPurchaseQueue.value && merchPurchaseQueue.value.length > 0
  clearTimeout(timeout)
  timeout = setTimeout(setNextMediaBoxItem, 20000)

  if (isDonationQueued) {
    nodecg.log.info('[MediaBox] Processing donation')
    const donation = donationQueue.value!.shift()
    if (donation) {
      currentMediaBoxItem.value = {
        type: 'donation',
        data: clone(donation),
      }
    }
  }
  else if (isTwitchSubQueued) {
    nodecg.log.info('[MediaBox] Processing sub')
    const sub = twitchSubQueue.value!.shift()
    if (sub) {
      currentMediaBoxItem.value = {
        type: 'sub',
        data: clone(sub),
      }
    }
  }
  else if (isTwitchBitsQueued) {
    nodecg.log.info('[MediaBox] Processing bits')
    const bits = twitchBitsQueue.value!.shift()
    if (bits) {
      currentMediaBoxItem.value = {
        type: 'cheer',
        data: clone(bits),
      }
    }
  }
  else if (isMerchQueued) {
    nodecg.log.info('[MediaBox] Processing merch')
    const merch = merchPurchaseQueue.value!.shift()
    if (merch) {
      currentMediaBoxItem.value = {
        type: 'merch',
        data: clone(merch),
      }
    }
  }
  else if (lastStage === 'MerchImage') {
    nodecg.log.info('[MediaBox] Processing Sponsor Image')
    lastStage = 'SponsorImage'
    sponsorIndex++
    if (sponsorIndex >= sponsorImages.value!.length) {
      sponsorIndex = 0
    }
    const images = {
      standard: {
        name: sponsorImages.value![sponsorIndex]
          ? sponsorImages.value![sponsorIndex].name
          : undefined,
        url: sponsorImages.value![sponsorIndex]
          ? sponsorImages.value![sponsorIndex].url
          : undefined,
      },
      widescreen: {
        name: sponsorImagesWidescreen.value![sponsorIndex]
          ? sponsorImagesWidescreen.value![sponsorIndex].name
          : undefined,
        url: sponsorImagesWidescreen.value![sponsorIndex]
          ? sponsorImagesWidescreen.value![sponsorIndex].url
          : undefined,
      },
    }
    currentMediaBoxItem.value = {
      type: 'image',
      data: images,
    }
  }
  else if (lastStage === 'SponsorImage') {
    nodecg.log.info('[MediaBox] Processing Merch image')
    lastStage = 'MerchImage'
    merchIndex++

    if (merchIndex >= merchImages.value!.length) {
      merchIndex = 0
    }
    const images = {
      standard: {
        name: merchImages.value![merchIndex]
          ? merchImages.value![merchIndex].name
          : undefined,
        url: merchImages.value![merchIndex]
          ? merchImages.value![merchIndex].url
          : undefined,
      },
      widescreen: {
        name: merchImagesWidescreen.value![merchIndex]
          ? merchImagesWidescreen.value![merchIndex].name
          : undefined,
        url: merchImagesWidescreen.value![merchIndex]
          ? merchImagesWidescreen.value![merchIndex].url
          : undefined,
      },
    }
    currentMediaBoxItem.value = {
      type: 'image',
      data: images,
    }
  }
}

setNextMediaBoxItem()
