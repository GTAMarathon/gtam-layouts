import type { CSSProperties } from 'react'
import { AutoTextSize } from 'auto-text-size'
import { useRef } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import useCurrentRun from '../../../../hooks/useCurrentRun'

interface Props {
  size: number
  style?: CSSProperties
}

export function Category({ style, size = 64 }: Props) {
  const currentRun = useCurrentRun()
  const categoryNameRef = useRef(null)

  return (
    <div style={{ position: 'fixed', ...style }}>
      {currentRun && (
        <SwitchTransition mode="out-in">
          <CSSTransition key={currentRun.customData['gameShort']} nodeRef={categoryNameRef} in appear timeout={1000} classNames="fade">
            <div className="Flex" style={{ position: 'absolute', flexDirection: 'column', fontSize: '1em' }}>
              <AutoTextSize
                as="div"
                style={{ fontSize: '1.3em' }}
                maxFontSizePx={size}
                ref={categoryNameRef}
                mode="box"
              >
                {currentRun.category}
              </AutoTextSize>
            </div>
          </CSSTransition>

        </SwitchTransition>
      )}
    </div>
  )
}
