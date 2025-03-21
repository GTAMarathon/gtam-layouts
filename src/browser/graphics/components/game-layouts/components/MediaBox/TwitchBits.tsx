import type { BitsQueueItem } from '@gtam-layouts/types'
import { getRandomEmote } from './randomEmote'

function getBitsColor(amount: number) {
  if (amount < 100) {
    return '#cbc8d0'
  }
  else if (amount > 100 && amount < 1000) {
    return '#ca7fff'
  }
  else if (amount > 1000 && amount < 5000) {
    return '#4aadff'
  }
  else if (amount > 5000 && amount < 10000) {
    return '#ff271e'
  }
  else if (amount > 10000 && amount < 25000) {
    return '#f161aa'
  }
  else if (amount > 25000 && amount < 50000) {
    return '#fb881d'
  }
  else if (amount > 50000 && amount < 75000) {
    return '#16d03d'
  }
  else if (amount > 75000 && amount < 100000) {
    return '#fcca0f'
  }
  else {
    return '#4fbafe'
  }
}

interface Props {
  bitsInfo: BitsQueueItem
}

export function MediaBoxTwitchBits({ bitsInfo }: Props) {
  const { name, amount } = bitsInfo

  return (
    <>
      {name && amount && (
        <div
          id="MediaBoxTwitchBits"
          style={{ textShadow: '2px 2px 2px #12222c', flexDirection: 'column', gap: '20px' }}
          className="Flex"
        >
          <img src={getRandomEmote()} />
          <span style={{ fontWeight: 'normal' }}>
            <b style={{ color: '#4fbafe' }}>{name}</b>
            has cheered
            <b style={{ color: getBitsColor(amount) }}>
              {amount}
              bits
            </b>
            !
          </span>
        </div>
      )}
    </>
  )
}
