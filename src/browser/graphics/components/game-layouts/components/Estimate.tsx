import type { CSSProperties } from 'react'
import useCurrentRun from '../../../../hooks/useCurrentRun'

interface Props {
  style?: CSSProperties
}

export function Estimate({ style }: Props) {
  const currentRun = useCurrentRun()

  return (
    <div className="Flex" style={{ position: 'fixed', flexDirection: 'column', ...style }}>
      {currentRun && currentRun.estimate && (
        <div id="Time" style={{ fontSize: '1.8em', marginBottom: '-0.2em' }}>
          EST:&nbsp;
          {currentRun.estimate}
        </div>
      )}
    </div>
  )
}
