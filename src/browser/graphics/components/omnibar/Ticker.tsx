import type { CSSProperties } from 'react'
import { useRef, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { GenericMessage } from './Ticker/GenericMessage'
import { NextRun } from './Ticker/NextRun'

export function Ticker({ style }: { style: CSSProperties }) {
  const currentComponentIndex = useRef(0)
  const currentComponentContainer = useRef<HTMLSpanElement | null>(null)
  const [timestamp, setTimestamp] = useState(Date.now())

  const messageTypes: React.JSX.Element[] = [
    genericMessage('Welcome to <span class="highlight">GTAMarathon 2025</span>! Enjoy the show!'),
    genericMessage('Check out the merch store over at <span class="highlight">merch.gtamarathon.com</span>!'),
    genericMessage(`Type <span class="highlight">!schedule</span> in the chat to see what's on next!`),
    <NextRun key={timestamp} time={20} onEnd={showNextElement} />,
  ]

  const [currentElement, setCurrentElement] = useState<React.JSX.Element | undefined>(messageTypes[0])

  function showNextElement() {
    console.log('Showing next omnibar message')

    currentComponentIndex.current = (currentComponentIndex.current + 1) % messageTypes.length
    const nextElement = messageTypes[currentComponentIndex.current]

    setTimestamp(Date.now())
    setCurrentElement(nextElement)
  }

  function genericMessage(message: string) {
    return <GenericMessage message={message} time={20} onEnd={showNextElement} />
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
          key={timestamp}
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
