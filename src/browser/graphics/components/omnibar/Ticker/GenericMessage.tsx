import { AutoTextSize } from 'auto-text-size'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface Props {
  message: string
  time: number
  onEnd: () => void
  containerRef: React.RefObject<HTMLDivElement>
  onScrollingNeeded?: (needed: boolean) => void
}

export function GenericMessage({ message, time, onEnd, containerRef, onScrollingNeeded }: Props) {
  const [scrollDistance, setScrollDistance] = useState(0)
  const textRef = useRef<HTMLDivElement>(null)
  const localContainerRef = useRef<HTMLDivElement>(null)
  const resizeObserverRef = useRef<ResizeObserver>()

  const TOTAL_DISPLAY_TIME = 20
  const START_PAUSE = 1
  const SCROLL_DURATION = 18

  useEffect(() => {
    console.log('GenericMessage: Mounted')
    const timeout = setTimeout(() => {
      console.log('GenericMessage: End')
      onEnd()
    }, time * 1000)

    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const updateScrollDistance = () => {
      if (textRef.current && localContainerRef.current) {
        const textWidth = textRef.current.scrollWidth
        const containerWidth = containerRef.current?.clientWidth || localContainerRef.current.clientWidth

        const needsScrolling = textWidth > containerWidth
        setScrollDistance(needsScrolling ? textWidth - (containerWidth - 60) : 0)

        if (onScrollingNeeded) {
          onScrollingNeeded(needsScrolling)
        }
      }
    }

    resizeObserverRef.current = new ResizeObserver(updateScrollDistance)
    if (textRef.current) {
      resizeObserverRef.current.observe(textRef.current)
    }

    updateScrollDistance()

    return () => {
      resizeObserverRef.current?.disconnect()
    }
  }, [message, containerRef, onScrollingNeeded])

  return (
    <div
      id="GenericMessage"
      ref={localContainerRef}
      style={{
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        whiteSpace: 'nowrap',
        textAlign: 'left',
        minWidth: '100%',
        maxWidth: '100%',
      }}
    >
      <AutoTextSize
        maxFontSizePx={64}
        minFontSizePx={38}
        mode="box"
        onResize={() => {
          setTimeout(() => {
            if (textRef.current && containerRef.current) {
              const textWidth = textRef.current.scrollWidth
              const containerWidth = containerRef.current.clientWidth
              setScrollDistance(textWidth - containerWidth)

              if (onScrollingNeeded) {
                onScrollingNeeded(textWidth > containerWidth)
              }
            }
          }, 100)
        }}
        style={{
          display: 'inline-block',
          verticalAlign: 'top',
        }}
      >
        <motion.div
          ref={textRef}
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
          }}
          animate={
            scrollDistance > 0
              ? {
                  x: [30, 30, -scrollDistance - 30, -scrollDistance - 30],
                }
              : {}
          }
          transition={
            scrollDistance > 0
              ? {
                  ease: 'linear',
                  duration: TOTAL_DISPLAY_TIME,
                  times: [
                    0,
                    START_PAUSE / TOTAL_DISPLAY_TIME,
                    (START_PAUSE + SCROLL_DURATION) / TOTAL_DISPLAY_TIME,
                    1,
                  ],
                }
              : {}
          }
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </AutoTextSize>
    </div>
  )
}
