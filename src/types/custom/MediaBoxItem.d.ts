import type { DonationQueueItem } from './DonationQueueItem'
import type { BitsQueueItem, MerchQueueItem, SubQueueItem } from './index'

interface MediaBoxImage {
  name: string | undefined
  url: string | undefined
}

export interface MediaBoxImages {
  standard: MediaBoxImage
  widescreen: MediaBoxImage
}

export interface MediaBoxItem {
  type: 'image' | 'sub' | 'cheer' | 'merch' | 'donation'
  data: BitsQueueItem | SubQueueItem | MerchQueueItem | MediaBoxImages | DonationQueueItem
}
