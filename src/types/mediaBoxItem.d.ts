import { BitsQueueItem, SubQueueItem, MerchQueueItem } from './index';

type MediaBoxImage = {
  name: string | undefined;
  url: string | undefined;
};

type MediaBoxImages = {
    standard: MediaBoxImage,
    widescreen: MediaBoxImage
}

export interface MediaBoxItem {
  type: 'image' | 'sub' | 'cheer' | 'merch';
  data: BitsQueueItem | SubQueueItem | MerchQueueItem | MediaBoxImages;
}
