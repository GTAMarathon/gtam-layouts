import { get } from './util/nodecg';
import { io } from 'socket.io-client';
import {
  twitchBitsQueue,
  twitchSubQueue,
  merchPurchaseQueue,
} from './util/replicants';
import {
  BitsQueueItem,
  MerchQueueItem,
  SubQueueItem,
} from '@gtam-layouts/types';
import * as SEEvents from './util/seEvents';

const nodecg = get();
const config = nodecg.bundleConfig.streamElements;

if (config.enabled) {
  const socket = io('https://realtime.streamelements.com', {
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    nodecg.log.info('[StreamElements] Successfully connected to websocket');
    socket.emit('authenticate', { method: 'jwt', token: config.token });
  });

  socket.on('authenticated', (data) => {
    const { channelId } = data;
    nodecg.log.info('[StreamElements] Authenticated successfully');
    nodecg.log.debug(
      `[StreamElements] Authenticated successfully with channel ${channelId}`
    );
  });

  socket.on('unauthorized', (err) => {
    nodecg.log.error('[StreamElements] Unauthorized socket error: ', err);
  });

  if (config.handleTestEvents) {
    socket.on('event:test', (data) => {
      handleSEEvent(data);
    });
  }

  socket.on('event', (data) => {
    handleSEEvent(data);
  });
}

function handleSEEvent(data: any) {
  if (data.listener == SEEvents.WindowEventType.CheerLatest) {
    const event = data.event as SEEvents.CheerLatestEvent;
    const bitsInfo: BitsQueueItem = {
      name: event.name,
      amount: event.amount,
    };
    twitchBitsQueue.value!.push(bitsInfo);
  } else if (data.listener == SEEvents.WindowEventType.SubscriberLatest) {
    const event = data.event as SEEvents.SubscriberLatestEvent;
    const subInfo: SubQueueItem = {
      name: event.name,
      months: event.amount,
      tier: getSubTier(event.tier),
      isGift: event.gifted || false,
      sender: event.sender,
    };
    if (!event.bulkGifted) {
      twitchSubQueue.value!.push(subInfo);
    }
  } else if (data.listener == SEEvents.WindowEventType.MerchLatest) {
    const event = data.event as SEEvents.MerchLatestEvent;
    const merchInfo: MerchQueueItem = {
      name: event.name,
      items: event.items,
    };
    merchPurchaseQueue.value!.push(merchInfo);
  }
}

function getSubTier(tier: string) {
  switch (tier) {
    case SEEvents.SubscribeTier.First:
    case SEEvents.SubscribeTier.Prime:
      return 1;
    case SEEvents.SubscribeTier.Second:
      return 2;
    case SEEvents.SubscribeTier.Third:
      return 3;
    default:
      return 1;
  }
}
