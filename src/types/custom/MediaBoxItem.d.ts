import type { BitsQueueItem, MerchQueueItem, SubQueueItem } from './index'

interface MediaBoxImage {
  name: string | undefined
  url: string | undefined
}

interface MediaBoxImages {
  standard: MediaBoxImage
  widescreen: MediaBoxImage
}

export interface MediaBoxItem {
  type: 'image' | 'sub' | 'cheer' | 'merch'
  data: BitsQueueItem | SubQueueItem | MerchQueueItem | MediaBoxImages
}
