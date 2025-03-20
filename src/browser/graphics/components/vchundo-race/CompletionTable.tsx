import type { HundoTrackerData } from '@gtam-layouts/types'
import type { CSSProperties } from 'react'
import { useReplicant } from '@nodecg/react-hooks'
import { PlayerCompletion } from './CompletionTable/PlayerCompletion'

interface Props {
  style?: CSSProperties
}

export function CompletionTable({ style }: Props) {
  const [hundoTrackerData] = useReplicant<HundoTrackerData>('hundoTrackerData')

  return (
    <div style={{ position: 'fixed', ...style }}>
      <table className="table table-bordered">
        {hundoTrackerData && (
          <>
            {hundoTrackerData.map((player, i) => (
              <PlayerCompletion
                key={player.name}
                player={player}
                position={i + 1}
              />
            ))}
          </>
        )}
      </table>
    </div>
  )
}
