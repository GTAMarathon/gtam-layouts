import type { SubQueueItem } from '@gtam-layouts/types'
import { getRandomEmote } from './randomEmote'

interface Props {
  subInfo: SubQueueItem
}

export function MediaBoxTwitchSub({ subInfo }: Props) {
  const { name, tier, months } = subInfo

  return (
    <>
      {name && tier && months && (
        <div
          id="MediaBoxTwitchSub"
          style={{
            textShadow: '2px 2px 2px #12222c',
            flexDirection: 'column',
            gap: '20px',
          }}
          className="Flex"
        >
          <img src={getRandomEmote()} />
          <span style={{ fontWeight: 'normal' }}>
            <b style={{ color: '#4fbafe' }}>{name}</b>
            has subscribed
            <b style={{ color: '#4fbafe' }}>
              Tier
              {tier}
            </b>
            subscription for
            <b style={{ color: '#4fbafe' }}>
              {months}
              months
            </b>
            !
          </span>
        </div>
      )}
    </>
  )
}
