import type {
  BitsQueueItem,
  MerchQueueItem,
  SubQueueItem,
} from '@gtam-layouts/types'
import { TaggedLogger } from '@gtam-layouts/util/tagged-logger'
import { io } from 'socket.io-client'
import { get } from './util/nodecg'
import {
  merchPurchaseQueue,
  twitchBitsQueue,
  twitchSubQueue,
} from './util/replicants'
import * as SEEvents from './util/seEvents'

const nodecg = get()
const config = nodecg.bundleConfig.streamElements
const logger = new TaggedLogger('StreamElements')

if (config.enabled) {
  const socket = io('https://realtime.streamelements.com', {
    transports: ['websocket'],
  })

  socket.on('connect', () => {
    logger.log('Successfully connected to websocket')
    socket.emit('authenticate', { method: 'jwt', token: config.token })
  })

  socket.on('authenticated', (data) => {
    const { channelId } = data
    logger.log('Authenticated successfully')
    logger.debug(
      `Authenticated successfully with channel ${channelId}`,
    )
  })

  socket.on('unauthorized', (err) => {
    logger.error('Unauthorized socket error: ', err)
  })

  socket.on('event', (data) => {
    logger.debug(
      `Received event: ${JSON.stringify(data)}`,
    )
    handleSEEvent(data)
  })
}

function handleSEEvent(data: any) {
  if (data.type === SEEvents.WindowEventType.CheerLatest) {
    logger.debug('Received cheer event')
    const event = data.data as SEEvents.CheerLatestEvent
    const bitsInfo: BitsQueueItem = {
      name: event.displayName,
      amount: event.amount,
    }
    twitchBitsQueue.value!.push(bitsInfo)
  }
  else if (data.type === SEEvents.WindowEventType.SubscriberLatest) {
    logger.debug('Received sub event')
    const event = data.data as SEEvents.SubscriberLatestEvent
    const subInfo: SubQueueItem = {
      name: event.displayName,
      months: event.amount,
      tier: getSubTier(event.tier),
    }
    twitchSubQueue.value!.push(subInfo)
  }
  else if (data.type === SEEvents.WindowEventType.MerchLatest) {
    logger.debug('Received merch event')
    const event = data.data as SEEvents.MerchLatestEvent
    const merchInfo: MerchQueueItem = {
      name: event.username,
      items: event.items,
    }
    merchPurchaseQueue.value!.push(merchInfo)
  }
}

function getSubTier(tier: string) {
  const subTier = tier.toString()
  if (subTier === '1000' || subTier === 'prime') {
    return 1
  }
  else if (subTier === '2000') {
    return 2
  }
  else if (subTier === '3000') {
    return 3
  }
  else {
    return 1
  }
}
