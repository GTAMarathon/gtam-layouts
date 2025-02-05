import type { CSSProperties } from 'react'
import { AutoTextSize } from 'auto-text-size'
import useCurrentRun from '../../../../hooks/useCurrentRun'

interface Props {
  size: number
  style?: CSSProperties
}

export function Game({ style, size = 64 }: Props) {
  const currentRun = useCurrentRun()

  return (
    <div style={{ position: 'fixed', ...style }}>
      {currentRun && (
        <div className="Flex" style={{ position: 'absolute', flexDirection: 'column', fontSize: '1em' }}>
          <AutoTextSize
            as="div"
            style={{ fontSize: '1.3em', width: '100%' }}
            maxFontSizePx={size}
            mode="boxoneline"
          >
            {currentRun.customData['gameShort'] ?? currentRun.game}
          </AutoTextSize>
        </div>

      )}
    </div>
  )
}
