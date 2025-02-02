import type { CSSProperties } from 'react'
import type { Timer as TimerType } from 'speedcontrol/types'
import { useReplicant } from '@nodecg/react-hooks'

interface Props {
  style?: CSSProperties
}

const timerColors = {
  stopped: '#a3a3a3',
  running: '#C736FF',
  paused: '#a304e2',
  finished: '#ffd557',
}

export function Timer({ style }: Props) {
  const [timer] = useReplicant<TimerType>('timer', { bundle: 'nodecg-speedcontrol' })

  return (
    <div className="Flex" style={{ flexDirection: 'column', position: 'fixed', ...style }}>
      {timer
      && (
        <div
          id="Timer"
          style={{
            fontSize: '2.8em',
            transition: '1s',
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
