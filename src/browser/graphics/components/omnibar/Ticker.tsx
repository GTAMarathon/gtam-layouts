import type { DonationGoal, TiltifyDonation } from '@gtam-layouts/types/custom/Tiltify-Types'
import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { NextMilestone } from './Ticker//NextMilestone'
import { GenericMessage } from './Ticker/GenericMessage'
import { NextRun } from './Ticker/NextRun'

export function Ticker({ style }: { style: CSSProperties }) {
  const currentComponentIndex = useRef(0)
  const currentComponentContainer = useRef<HTMLSpanElement | null>(null)
  const [timestamp, setTimestamp] = useState(Date.now())
  const [donationsQueue, setDonationsQueue] = useState<TiltifyDonation[]>([])
  const [messageTypes, setMessageTypes] = useState<React.JSX.Element[]>([])
  const [currentElement, setCurrentElement] = useState<React.JSX.Element | undefined>()
  const messageTypesRef = useRef<React.JSX.Element[]>([])
  const [hasActiveGoals, setHasActiveGoals] = useState(false)
  const donationTotal = nodecg.Replicant<number>('donationTotal')
  const donationGoals = nodecg.Replicant<DonationGoal[]>('donationGoals')

  const donationsToShow = nodecg.Replicant<TiltifyDonation[]>('donationsToShow', {
    defaultValue: [],
    persistent: false,
  })

  const donationsShown = nodecg.Replicant<string[]>('donationsShown', {
    defaultValue: [],
    persistent: true,
  })

  useEffect(() => {
    NodeCG.waitForReplicants(donationGoals).then(() => {
      const handler = (goals: DonationGoal[] = []) => {
        const activeGoals = goals.some(goal => (donationTotal.value ?? 0) < goal.amount)
        setHasActiveGoals(activeGoals)
      }
      donationGoals.on('change', handler)
      return () => donationGoals.removeListener('change', handler)
    })
  }, [donationGoals, donationTotal.value])

  useEffect(() => {
    NodeCG.waitForReplicants(donationsToShow, donationsShown).then(() => {
      const handler = (newVal: TiltifyDonation[] = []) => {
        setDonationsQueue(newVal)
      }
      donationsToShow.on('change', handler)
      return () => donationsToShow.removeListener('change', handler)
    })
  }, [donationsShown, donationsToShow])

  useEffect(() => {
    const newMessages = [
      ...donationsQueue.map(donation => (
        <GenericMessage
          key={donation.id}
          message={`New <b class="highlight">$${donation.amount.toFixed(0)}</b> donation from <span class="highlight">${donation.name}</span>`}
          time={20}
          onEnd={() => handleDonationEnd(donation.id)}
        />
      )),
      genericMessage('welcome', 'Welcome to <span class="highlight">GTAMarathon 2025</span>! Enjoy the show!'),
      genericMessage('merch', 'Check out the merch store over at <span class="highlight">merch.gtamarathon.com</span>!'),
      genericMessage('schedule', `Type <span class="highlight">!schedule</span> in the chat to see what's on next!`),
      <NextRun key="next-run" time={20} onEnd={showNextElement} />,
      ...(hasActiveGoals ? [<NextMilestone key="next-milestone" time={20} onEnd={showNextElement} />] : []),
    ]

    setMessageTypes(newMessages)
    messageTypesRef.current = newMessages
    setCurrentElement(newMessages[0])

    function handleDonationEnd(donationId: string) {
      if (donationsShown.value && donationsToShow.value) {
        donationsShown.value = [...donationsShown.value, donationId]
        donationsToShow.value = donationsToShow.value.filter(d => d.id !== donationId)
      }
      showNextElement()
    }

    function genericMessage(key: string, message: string) {
      return <GenericMessage key={key} message={message} time={20} onEnd={showNextElement} />
    }
  }, [donationsQueue, hasActiveGoals, donationsShown, donationsToShow])

  useEffect(() => {
    currentComponentIndex.current = 0
  }, [messageTypes])

  function showNextElement() {
    console.log('Showing next omnibar message')

    currentComponentIndex.current = (currentComponentIndex.current + 1) % messageTypesRef.current.length
    const nextElement = messageTypesRef.current[currentComponentIndex.current]

    setTimestamp(Date.now())
    setCurrentElement(nextElement)
  }

  return (
    <div
      id="Ticker"
      style={{
        overflow: 'hidden',
        flex: '0 0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
    >
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={currentElement?.key || 'fallback'}
          nodeRef={currentComponentContainer}
          in={!!currentElement}
          appear
          timeout={1000}
          classNames={{
            enter: 'animate__animated animate__slideInUp',
            exit: 'animate__animated animate__slideOutUp',
          }}
        >
          <span key={timestamp} ref={currentComponentContainer}>
            {currentElement ?? <span />}
          </span>
        </CSSTransition>
      </SwitchTransition>

    </div>
  )
}
