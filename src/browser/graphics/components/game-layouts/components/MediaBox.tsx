import type { BitsQueueItem, MediaBoxImages, MediaBoxItem, SubQueueItem } from '@gtam-layouts/types'
import type { CSSProperties } from 'react'
import { useReplicant } from '@nodecg/react-hooks'
import { useEffect, useRef } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { MediaBoxImage } from './MediaBox/Image'
import { MediaBoxTwitchBits } from './MediaBox/TwitchBits'
import { MediaBoxTwitchSub } from './MediaBox/TwitchSub'

interface Props {
  useWidescreenImages?: boolean
  style?: CSSProperties
}

export function MediaBox({ useWidescreenImages = false, style }: Props) {
  const [currentComponent] = useReplicant<MediaBoxItem, MediaBoxItem>(
    'currentMediaBoxItem',
    { bundle: 'gtam-layouts' },
  )
  const timestamp = useRef(Date.now())
  const componentDivRef = useRef(null)

  useEffect(() => {
    timestamp.current = Date.now()
  }, [currentComponent])

  return (
    <div
      id="MediaBox"
      style={{
        margin: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        verticalAlign: 'middle',
        position: 'fixed',
        boxSizing: 'border-box',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
    >
      {currentComponent && (
        <div
          id="MediaBoxContainer"
          style={{
            width: '100%',
            height: '100%',
            margin: 'auto',
          }}
        >
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={timestamp.current}
              nodeRef={componentDivRef}
              in
              appear
              timeout={1000}
              classNames="fade"
            >
              <div ref={componentDivRef}>
                {currentComponent.type === 'image'
                && (
                  <MediaBoxImage
                    useWidescreenImages={useWidescreenImages}
                    images={currentComponent.data as MediaBoxImages}
                  />
                )}
                {currentComponent.type === 'cheer' && (
                  <MediaBoxTwitchBits bitsInfo={currentComponent.data as BitsQueueItem} />
                )}
                {currentComponent.type === 'sub' && (
                  <MediaBoxTwitchSub subInfo={currentComponent.data as SubQueueItem} />
                )}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </div>
      )}
    </div>
  )
}
