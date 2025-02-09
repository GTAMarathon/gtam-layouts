import type { CSSProperties } from 'react'
import type { RunData } from 'speedcontrol/types'
import { AutoTextSize } from 'auto-text-size'
import { useRef } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

interface Props {
  run: RunData
  style: CSSProperties
}

export function UpcomingRun({ run, style }: Props) {
  const bigFontSize = 48
  const bigWidth = 872
  const catRatio = 0.75
  const minSizeRatio = 0.4

  const runComponentRef = useRef(null)

  return (
    <div style={{ position: 'fixed', ...style }}>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={run.id}
          nodeRef={runComponentRef}
          in
          appear
          timeout={1000}
          classNames="fade"
        >
          <div
            key={run.id}
            ref={runComponentRef}
            className="Flex"
            style={{
              paddingLeft: '15px',
              paddingRight: '15px',
              width: `${bigWidth}px`,
            }}
          >
            <div
              style={{
                flexDirection: 'column',
                textAlign: 'left',
                alignItems: 'normal',
              }}
            >
              <AutoTextSize
                id="game"
                as="div"
                minFontSizePx={bigFontSize * minSizeRatio}
                maxFontSizePx={bigFontSize}
                mode="boxoneline"
                style={{
                  width: `${bigWidth}px`,
                  marginBottom: '-5px',
                }}
              >
                {run.game}
              </AutoTextSize>
              <AutoTextSize
                id="category"
                as="div"
                minFontSizePx={bigFontSize * minSizeRatio * catRatio}
                maxFontSizePx={bigFontSize * catRatio}
                mode="boxoneline"
                style={{
                  width: `${bigWidth}px`,
                  marginBottom: '-5px',
                }}
              >
                {run.category}
              </AutoTextSize>
            </div>
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}
