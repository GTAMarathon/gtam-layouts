import gsap from 'gsap'
import { useEffect, useRef } from 'react'

interface DonationTotalProps {
  style?: React.CSSProperties
}

const donationTotal = nodecg.Replicant<number>('donationTotal')

const DonationTotalComponent: React.FC<DonationTotalProps> = ({ style }) => {
  const totalRef = useRef<HTMLDivElement | null>(null)
  const data = { total: donationTotal.value ?? 0 }

  useEffect(() => {
    if (!donationTotal || !donationTotal.on)
      return

    const updateHandler = (newVal: number | undefined) => {
      if (typeof newVal !== 'number') {
        console.warn('Received invalid donation total:', newVal)
        return
      }

      console.log('donationTotal changed:', newVal)
      gsap.to(data, {
        duration: 2,
        total: newVal,
        roundProps: 'total',
        ease: 'power4',
        onUpdate: () => {
          if (totalRef.current) {
            totalRef.current.innerHTML = `$${data.total.toLocaleString('en-US', {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            })}`
          }
        },
      })
    }

    updateHandler(donationTotal.value)

    donationTotal.on('change', updateHandler)

    return () => {
      donationTotal.off('change', updateHandler)
    }
  }, [])

  return (
    <div
      style={{
        fontSize: '3em',
        color: 'black',
        backgroundColor: '#00ff82',
        display: 'flex',
        alignItems: 'center',
        float: 'right',
        ...style,
      }}
    >
      <div
        id="Total"
        ref={totalRef}
        style={{ marginLeft: '20px', marginRight: '20px' }}
      >
        {`$${data.total.toLocaleString('en-US', {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        })}`}
      </div>
    </div>
  )
}

export default DonationTotalComponent
