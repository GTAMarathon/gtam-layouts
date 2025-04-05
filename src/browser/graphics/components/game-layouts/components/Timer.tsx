import type { CSSProperties } from 'react'
import type { Timer as TimerType } from 'speedcontrol/types'
import { useReplicant } from '@nodecg/react-hooks'

interface Props {
  style?: CSSProperties
}

const timerColors = {
  stopped: '#a4a4a4',
  running: '#ffe400',
  paused: '#a4a4a4',
  finished: '#ffe400',
}

export function Timer({ style }: Props) {
  const [timer] = useReplicant<TimerType>('timer', { bundle: 'nodecg-speedcontrol' })

  return (
    <div
      className="Flex"
      style={{
        flexDirection: 'column',
        position: 'fixed',
        ...style,
      }}
    >
      {timer
      && (
        <div
          id="Timer"
          className={timer.state === 'finished' ? 'timer-flash' : ''}
          style={{
            fontSize: '2.8em',
            transition: 'color 1s',
            marginBottom: '-0.2em',
            color: timerColors[timer.state],
          }}
        >
          {timer.time.split('').map(char => (
            <span
              className={char === ':' ? 'Colon' : undefined}
              key={`${Math.random()}${char}`}
            >
              {char}
            </span>
          ))}

        </div>
      )}
    </div>
  )
}
