import type { DonationQueueItem } from '@gtam-layouts/types'
import { getRandomEmote } from './randomEmote'

interface Props {
  donationInfo: DonationQueueItem
}

export function MediaBoxDonation({ donationInfo }: Props) {
  const { name, amount } = donationInfo

  return (
    <>
      {name && amount && (
        <div
          id="MediaBoxDonation"
          style={{
            textShadow: '2px 2px 2px #12222c',
            flexDirection: 'column',
            gap: '20px',
            width: '100%',
          }}
          className="Flex"
        >
          <img src={getRandomEmote()} />
          <span style={{ fontWeight: 'normal' }}>
            New
            {' '}
            <b style={{ color: '#ffe400', fontFamily: 'Slope Opera', fontSize: '2rem' }}>
              $
              {amount}
            </b>
            {' '}
            donation from
            {' '}
            <br />
            <b style={{ color: '#4fbafe' }}>{name}</b>
            !
          </span>
        </div>
      )}
    </>
  )
}
