import {
  merchPurchaseQueue,
  twitchBitsQueue,
  twitchSubQueue,
  sponsorImages,
  sponsorImagesWidescreen,
  merchImages,
  merchImagesWidescreen,
  currentMediaBoxItem,
} from './util/replicants';
import { get } from './util/nodecg';
import clone from 'clone';

const nodecg = get();
let sponsorIndex = 0;
let merchIndex = 0;
let lastStage: MediaBoxStages = 'MerchImage';
let timeout: NodeJS.Timeout;

type MediaBoxStages = 'MerchImage' | 'SponsorImage';

const isTwitchSubQueued = () => {
  if (twitchSubQueue.value) {
    return twitchSubQueue.value.length > 0;
  } else {
    return false;
  }
};

const isTwitchBitsQueued = () => {
  if (twitchBitsQueue.value) {
    return twitchBitsQueue.value.length > 0;
  } else {
    return false;
  }
};

const isMerchQueued = () => {
  if (merchPurchaseQueue.value) {
    return merchPurchaseQueue.value.length > 0;
  } else {
    return false;
  }
};

function setNextMediaBoxItem(): void {
  clearTimeout(timeout);
  timeout = setTimeout(setNextMediaBoxItem, 20000);
  if (isTwitchSubQueued()) {
    const sub = twitchSubQueue.value!.shift();
    if (sub) {
      currentMediaBoxItem.value = {
        type: 'sub',
        data: clone(sub),
      };
    }
    return;
  } else if (isTwitchBitsQueued()) {
    const bits = twitchBitsQueue.value!.shift();
    if (bits) {
      currentMediaBoxItem.value = {
        type: 'cheer',
        data: clone(bits),
      };
    }
    return;
  } else if (isMerchQueued()) {
    const merch = merchPurchaseQueue.value!.shift();
    if (merch) {
      currentMediaBoxItem.value = {
        type: 'merch',
        data: clone(merch),
      };
    }
    return;
  } else if (lastStage === 'MerchImage') {
    lastStage = 'SponsorImage';
    sponsorIndex++;
    if (sponsorIndex >= sponsorImages.value!.length) {
      sponsorIndex = 0;
    }
    let images = {
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
    };
    currentMediaBoxItem.value = {
      type: 'image',
      data: images,
    };
    return;
  } else if (lastStage === 'SponsorImage') {
    lastStage = 'MerchImage';
    merchIndex++;

    if (merchIndex >= merchImages.value!.length) {
      merchIndex = 0;
    }
    let images = {
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
    };
    currentMediaBoxItem.value = {
      type: 'image',
      data: images,
    };
    return;
  }
}

setNextMediaBoxItem();
