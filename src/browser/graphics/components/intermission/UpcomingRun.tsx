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
  const bigFontSize = 56
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
                  marginBottom: '-1px',
                }}
              >
                {run.game!.length < 50 ? run.game : run.customData['gameShort']}
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
                  fontFamily: 'Bebas Neue',
                  color: '#a4a4a4',
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
