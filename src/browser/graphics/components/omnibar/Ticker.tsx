import type { DonationGoal } from '@gtam-layouts/types/custom/Tiltify-Types'
import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { NextMilestone } from './Ticker//NextMilestone'
import { GenericMessage } from './Ticker/GenericMessage'
import { NextRun } from './Ticker/NextRun'

export function Ticker({ style }: { style: CSSProperties }) {
  const currentComponentIndex = useRef(0)
  const currentComponentContainer = useRef<HTMLSpanElement | null>(null)
  const [messageTypes, setMessageTypes] = useState<React.JSX.Element[]>([])
  const [currentElement, setCurrentElement] = useState<React.JSX.Element | undefined>()
  const messageTypesRef = useRef<React.JSX.Element[]>([])
  const [hasActiveGoals, setHasActiveGoals] = useState(false)
  const donationTotal = nodecg.Replicant<number>('donationTotal')
  const donationGoals = nodecg.Replicant<DonationGoal[]>('donationGoals')
  const tickerContainerRef = useRef<HTMLDivElement | null>(null)
  const [needsScrolling, setNeedsScrolling] = useState(false)

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
    const newMessages = [
      genericMessage('welcome', 'Welcome to <span class="highlight">GTAMarathon 2025</span>! Enjoy the show!'),
      genericMessage('merch', 'Check out the merch store over at <span class="highlight">merch.gtamarathon.com</span>!'),
      genericMessage('schedule', `Type <span class="highlight">!schedule</span> in the chat to see what's on next!`),
      <NextRun key={currentComponentIndex.current} time={20} onEnd={showNextElement} containerRef={tickerContainerRef} onScrollingNeeded={setNeedsScrolling} />,
      ...(hasActiveGoals ? [<NextMilestone key="next-milestone" time={20} onEnd={showNextElement} />] : []),
    ]

    setMessageTypes(newMessages)
    messageTypesRef.current = newMessages
    setCurrentElement(newMessages[0])

    function genericMessage(key: string, message: string) {
      return <GenericMessage key={key} message={message} time={20} onEnd={showNextElement} containerRef={tickerContainerRef} onScrollingNeeded={setNeedsScrolling} />
    }
  }, [hasActiveGoals])

  useEffect(() => {
    currentComponentIndex.current = 0
  }, [messageTypes])

  function showNextElement() {
    console.log('Showing next omnibar message')

    currentComponentIndex.current = (currentComponentIndex.current + 1) % messageTypesRef.current.length
    const nextElement = messageTypesRef.current[currentComponentIndex.current]

    if (nextElement!.type !== NextMilestone) {
      setNeedsScrolling(true)
    }
    else {
      setNeedsScrolling(false)
    }

    setCurrentElement(nextElement)
  }

  return (
    <div
      id="Ticker"
      style={{
        overflow: 'hidden',
        flex: '0 0 auto',
        display: 'flex',
        justifyContent: needsScrolling ? 'flex-start' : 'center',
        alignItems: 'center',
        ...style,
      }}
      ref={tickerContainerRef}
    >
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={currentComponentIndex.current}
          nodeRef={currentComponentContainer}
          timeout={1000}
          classNames={{
            enter: 'animate__animated animate__slideInUp',
            exit: 'animate__animated animate__slideOutUp',
          }}
        >
          <span ref={currentComponentContainer}>
            {currentElement ?? <span />}
          </span>
        </CSSTransition>
      </SwitchTransition>

    </div>
  )
}
