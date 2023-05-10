export enum WindowEventType {
  /**
   * Fired when a new subscriber comes through.
   *
   * @warn Be careful! This event will be fired for both regular subscribers,
   * direct subscribers and bulk subscribers. If a subscription is a community
   * (bulk) subscription, then this event will be fired for the initial bulk
   * gift and then, subsequently, for each receiver.
   */
  SubscriberLatest = 'subscriber-latest',
  /** Fired when a cheer happens. */
  CheerLatest = 'cheer-latest',
  /** Fired when merch is bought. */
  MerchLatest = 'merch-latest',
}

/**
 * Represents the subscription tier a twitch user might do.
 */
export enum SubscribeTier {
  /** Amazon Prime */
  Prime = 'prime',
  /** 4.99$ */
  First = '1000',
  /** 9.99$ */
  Second = '2000',
  /** 24.99$ */
  Third = '3000',
}

/**
 * Represents an event that StreamElements might fire.
 */
export interface Event {}

/**
 * Event fired given a subscriber-latest event.
 */
export interface SubscriberLatestEvent extends Event {
  /**
   * The number of months subscribed.
   *
   * If this is a gift this will be one, or 2+ if this is a bulk gift.
   */
  amount: number;

  /** Unknown */
  count: number;

  /**
   * Whether the event is a test event fired from the StreamElements overlay design interface.
   *
   * Appears to be undefined for bulk gifts.
   */
  isTest?: boolean;

  /**
   * Unknown
   *
   * Appears to be undefined for bulk gifts.
   */
  items?: unknown[];

  /** Subscriber-sent message accompanying the subscribal */
  message: string;

  /**
   * Unknown
   *
   * Appears to be undefined for bulk gifts.
   */
  month?: string;

  /** Username of the subscriber.
   *
   * If the sub has been gifted, this refers to the receiver. For a bulk gift event, this value
   * will be the same as the sender.
   */
  name: string;

  /** Unknown */
  originalEventName: string;

  /**
   * Unknown
   *
   * Appears to be undefined for bulk gifts.
   */
  sessionTop?: boolean;

  /** The tier a twitch user might subscribe on. */
  tier: SubscribeTier;

  /** Unknown */
  type: string;

  /** If the sub has been gifted, this is defined to be true */
  gifted?: boolean;

  /** If the sub has been bulk-gifted, this is defined as true. */
  bulkGifted?: boolean;

  /** If the sub is gifted, then this will contain the username of the gifter */
  sender?: string;

  /** Unknown. Only exists if the sub is gifted. */
  subExtension?: boolean;

  /**
   * Whether the current event is a community gift.
   *
   * @warn This will be set to true for events that occur on giftees. When a bulk gift occurs, the
   *       initial bulk gift event will not contain this field, but since SE emits each gifted sub
   *       as an event, those subsequent fields receive `isCommunityGift` as true.
   */
  isCommunityGift?: boolean;

  /**
   * Unknown
   *
   * Appears to only exist for bulk-gift sub giftee events.
   */
  playedAsCommunityGift?: boolean;
}

/**
 * Event fired given a cheer-latest event.
 */
export interface CheerLatestEvent extends Event {
  /** The number of bits cheered */
  amount: number;
  /** Unknown */
  count: number;
  /** Whether the event is a test event fired from the StreamElements overlay design interface. */
  isTest: boolean;
  /** Unknown */
  items: unknown[];
  /** Accompanying message */
  message: string;
  /** Unknown */
  month: string;
  /** Username of the sender */
  name: string;
  /** Unknown */
  originalEventName: string;
  /** Unknown */
  sessionTop: boolean;
  /** Unknown. */
  tier: SubscribeTier;
  /** Whether text-to-speech is requested. */
  tts: boolean;
  /** Unknown */
  type: string;
}

/**
 * Event fired given a merch-latest event.
 */
export interface MerchLatestEvent extends Event {
  /** Event type */
  type: string;
  /** Name of the sender */
  name: string;
  /** Unknown */
  amount: number;
  /** Unknown */
  count: number;
  /** Array of items bought */
  items: MerchItem[];
  /** Unknown */
  tier: string;
  /** Unknown */
  month: string;
  /** Whether the event is a test event fired from the StreamElements overlay design interface. */
  isTest: boolean;
}

export type MerchItem = {
  /**
   * Name of the item.
   */
  name: string;
  /** Price of the item. */
  price: number;
  /** Amount of the item bought. */
  quantity: number;
}
