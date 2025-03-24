import type { DonationGoal } from '../../../../../types/custom/Tiltify-Types'
import { AutoTextSize } from 'auto-text-size'
import { useEffect, useState } from 'react'

interface Props {
  time: number
  onEnd: () => void
}

const donationTotal = nodecg.Replicant<number>('donationTotal')
const donationGoals = nodecg.Replicant<DonationGoal[]>('donationGoals')

export function NextMilestone({ time, onEnd }: Props) {
  const [message, setMessage] = useState('')
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    console.log('NextMilestone: Mounted')
    let isMounted = true

    NodeCG.waitForReplicants(donationTotal, donationGoals).then(() => {
      if (!isMounted)
        return

      const updateMessage = () => {
        const total = donationTotal.value ?? 0
        const goals = donationGoals.value ?? []
        const sortedGoals = [...goals].sort((a, b) => a.amount - b.amount)
        const nextGoal = sortedGoals.find(goal => total < goal.amount)

        if (nextGoal) {
          const formattedTotal = total.toLocaleString('en-US', { maximumFractionDigits: 0 })
          const formattedGoal = nextGoal.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })
          setMessage(
            `Next goal: ${nextGoal.name} - `
            + `<span class="highlight">$${formattedTotal}</span>/`
            + `<span class="highlight">$${formattedGoal}</span>`,
          )
          setHasInitialized(true)
        }
        else if (goals.length === 0) {
          console.log('No goals available')
          onEnd()
        }
        else {
          console.log('All goals completed')
          onEnd()
        }
      }

      // Initial update
      updateMessage()

      donationTotal.on('change', updateMessage)
      donationGoals.on('change', updateMessage)

      // Auto-advance timer only if valid goal exists
      if (donationGoals.value && donationGoals.value.length > 0) {
        const timer = setTimeout(() => {
          console.log('NextMilestone: Completed display duration')
          onEnd()
        }, time * 1000)

        return () => {
          clearTimeout(timer)
          donationTotal.removeListener('change', updateMessage)
          donationGoals.removeListener('change', updateMessage)
        }
      }

      return () => {
        donationTotal.removeListener('change', updateMessage)
        donationGoals.removeListener('change', updateMessage)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  if (!hasInitialized)
    return null

  return (
    <div style={{ width: '100%', fontSize: '3em' }}>
      <AutoTextSize
        maxFontSizePx={100}
        mode="box"
        as="div"
        id="NextMilestone"
        dangerouslySetInnerHTML={{ __html: message }}
      />
    </div>
  )
}
