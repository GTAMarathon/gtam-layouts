import type { CSSProperties } from 'react'
import useCurrentRun from '../../../../hooks/useCurrentRun'

interface Props {
  style?: CSSProperties
}

export function Estimate({ style }: Props) {
  const currentRun = useCurrentRun()

  return (
    <div
      className="Flex"
      style={{
        position: 'fixed',
        flexDirection: 'column',
        ...style,
      }}
    >
      {currentRun && currentRun.estimate && (
        <div
          id="Time"
          style={{ fontSize: '1.3em', marginBottom: '-0.2em', color: '#a4a4a4', fontFamily: 'Bebas Neue' }}
        >
          EST:&nbsp;
          {currentRun.estimate}
        </div>
      )}
    </div>
  )
}
