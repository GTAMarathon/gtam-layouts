export enum WindowEventType {
  /**
   * Fired when a new subscriber comes through.
   *
   * @warn Be careful! This event will be fired for both regular subscribers,
   * direct subscribers and bulk subscribers. If a subscription is a community
   * (bulk) subscription, then this event will be fired for the initial bulk
   * gift and then, subsequently, for each receiver.
   */
  SubscriberLatest = 'subscriber',
  /** Fired when a cheer happens. */
  CheerLatest = 'cheer',
  /** Fired when merch is bought. */
  MerchLatest = 'merch',
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
  amount: number

  /** Subscriber-sent message accompanying the subscribal */
  message: string

  /** The sub streak. */
  streak: number

  /**
   * Username of the subscriber.
   *
   * If the sub has been gifted, this refers to the receiver. For a bulk gift event, this value
   * will be the same as the sender.
   */
  username: string

  /** Display name of the subscriber */
  displayName: string

  /** The tier a twitch user might subscribe on. */
  tier: SubscribeTier

  /** Unknown */
  type: string

  /** If the sub is gifted, then this will contain the username of the gifter */
  sender?: string

  /** Unknown */
  quantity: number

  /** The user's Twitch avatar */
  avatar: string
}

/**
 * Event fired given a cheer-latest event.
 */
export interface CheerLatestEvent extends Event {
  /** The number of bits cheered */
  amount: number
  /** Display name of the sender */
  displayName: string
  /** Accompanying message */
  message: string
  /** Username of the sender */
  username: string
}

/**
 * Event fired given a merch-latest event.
 */
export interface MerchLatestEvent extends Event {
  /** Name of the sender */
  username: string
  /** Currency used in the transaction */
  currency: string
  /** Amount of items bought */
  quantity: number
  /** Array of items bought */
  items: MerchItem[]
  /** Unknown */
  message: string
  /** The user's StreamElements avatar */
  avatar: string
  /** Unknown */
  amount: number
}

export interface MerchItem {
  /**
   * Name of the item.
   */
  name: string
  /** Price of the item. */
  price: number
  /** Amount of the item bought. */
  quantity: number
}
