import gsap from 'gsap'
import { useEffect, useRef } from 'react'

interface DonationTotalProps {
  style?: React.CSSProperties
}

const donationTotal = nodecg.Replicant<number>('donationTotal')

const DonationTotalComponent: React.FC<DonationTotalProps> = ({ style }) => {
  const totalRef = useRef<HTMLDivElement | null>(null)
  const dataRef = useRef({ total: donationTotal.value ?? 0 })

  useEffect(() => {
    if (!donationTotal || !donationTotal.on)
      return

    const updateHandler = (newVal: number | undefined) => {
      if (typeof newVal !== 'number') {
        console.warn('Received invalid donation total:', newVal)
        return
      }

      console.log('donationTotal changed:', newVal)
      gsap.to(dataRef.current, {
        duration: 2,
        total: newVal,
        roundProps: 'total',
        ease: 'power4',
        onUpdate: () => {
          if (totalRef.current) {
            totalRef.current.innerHTML = `$${dataRef.current.total.toLocaleString('en-US', {
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
        position: 'absolute',
        left: '193px',
        top: '41px',
        transform: 'translateY(-50%)',
        width: '185px',
        height: '57px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '2.5em',
        color: 'black',
        fontFamily: 'slope_operaregular',
        ...style,
      }}
    >
      <div id="Total" ref={totalRef}>
        {`$${dataRef.current.total.toLocaleString('en-US', {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        })}`}
      </div>
    </div>
  )
}

export default DonationTotalComponent
