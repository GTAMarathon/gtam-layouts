import type { CSSProperties } from 'react'
import type { Timer as TimerType } from 'speedcontrol/types'
import { useReplicant } from '@nodecg/react-hooks'

interface Props {
  style?: CSSProperties
}

export function Timer({ style }: Props) {
  const [timer] = useReplicant<TimerType>('timer', { bundle: 'nodecg-speedcontrol' })

  return (
    <div className="Flex" style={{ flexDirection: 'column', position: 'fixed', ...style }}>
      <div
        id="Time"
        style={{
          fontSize: '2.3em',
          transition: '1s',
          marginBottom: '-0.2em',
        }}
      >
        {timer
        && <span style={{ display: 'inline-block', textAlign: 'center', color: '#a1ebff' }}>{timer.time}</span>}
      </div>
    </div>
  )
}
