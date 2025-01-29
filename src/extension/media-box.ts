import {
  currentMediaBoxItem,
  merchImages,
  merchImagesWidescreen,
  merchPurchaseQueue,
  sponsorImages,
  sponsorImagesWidescreen,
  twitchBitsQueue,
  twitchSubQueue,
} from '@gtam-layouts/util/replicants'
import { klona as clone } from 'klona/json'

type MediaBoxStages = 'MerchImage' | 'SponsorImage'

let sponsorIndex = 0
let merchIndex = 0
let lastStage: MediaBoxStages = 'MerchImage'
let timeout: NodeJS.Timeout

const isTwitchSubQueued = twitchSubQueue.value && twitchSubQueue.value.length > 0
const isTwitchBitsQueued = twitchBitsQueue.value && twitchBitsQueue.value.length > 0
const isMerchQueued = merchPurchaseQueue.value && merchPurchaseQueue.value.length > 0

function setNextMediaBoxItem(): void {
  clearTimeout(timeout)
  timeout = setTimeout(setNextMediaBoxItem, 20000)
  if (isTwitchSubQueued) {
    const sub = twitchSubQueue.value!.shift()
    if (sub) {
      currentMediaBoxItem.value = {
        type: 'sub',
        data: clone(sub),
      }
    }
  }
  else if (isTwitchBitsQueued) {
    const bits = twitchBitsQueue.value!.shift()
    if (bits) {
      currentMediaBoxItem.value = {
        type: 'cheer',
        data: clone(bits),
      }
    }
  }
  else if (isMerchQueued) {
    const merch = merchPurchaseQueue.value!.shift()
    if (merch) {
      currentMediaBoxItem.value = {
        type: 'merch',
        data: clone(merch),
      }
    }
  }
  else if (lastStage === 'MerchImage') {
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
