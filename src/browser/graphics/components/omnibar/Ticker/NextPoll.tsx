import type { TiltifyPoll } from '@gtam-layouts/types/custom/Tiltify-Types'
import { AutoTextSize } from 'auto-text-size'
import { motion } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const polls = nodecg.Replicant<TiltifyPoll[]>('polls')

interface Props {
  time: number
  onEnd: () => void
  onScrollingNeeded?: (needsScrolling: boolean) => void
  containerRef: React.RefObject<HTMLDivElement>
}

export function NextPoll({ time, onEnd, containerRef, onScrollingNeeded }: Props) {
  const [msg, setMsg] = useState('')
  const [scrollDistance, setScrollDistance] = useState(0)
  const [forceKey, setForceKey] = useState(0)

  const resizeObserverRef = useRef<ResizeObserver>()
  const textRef = useRef<HTMLDivElement>(null)
  const localContainerRef = useRef<HTMLDivElement>(null)

  const TOTAL_DISPLAY_TIME = 20
  const START_PAUSE = 1
  const SCROLL_DURATION = 18

  useEffect(() => {
    onScrollingNeeded?.(scrollDistance > 0)
  }, [scrollDistance, onScrollingNeeded])

  useLayoutEffect(() => {
    setForceKey(prev => prev + 1)
  }, [msg])

  useLayoutEffect(() => {
    NodeCG.waitForReplicants(polls).then(() => {
      const poll = polls.value?.[0]
      if (!poll) {
        onEnd()
        return
      }

      const pollOptions = poll.options.map(option => `${option.name} - <span class="highlight">${option.amount} ${option.currency}</span>`)

      setMsg(`Next bidwar: ${poll.name} - ${pollOptions.join(',  ')}`)
    })

    const exitTimeout = setTimeout(() => {
      onEnd()
    }, time * 1000)

    return () => {
      clearTimeout(exitTimeout)
    }
  }, [])

  useEffect(() => {
    const updateScrollDistance = () => {
      if (textRef.current && localContainerRef.current) {
        const textWidth = textRef.current.scrollWidth
        const containerWidth = containerRef.current?.clientWidth || localContainerRef.current.clientWidth

        if (textWidth > containerWidth) {
          setScrollDistance(textWidth - (containerWidth - 60))
        }
        else {
          setScrollDistance(0)
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
  }, [msg, containerRef])

  return (
    <div
      key={`next-poll-${forceKey}`}
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
        maxFontSizePx={46}
        minFontSizePx={38}
        mode="box"
        onResize={() => {
          setTimeout(() => {
            if (textRef.current && containerRef.current) {
              const textWidth = textRef.current.scrollWidth
              const containerWidth = containerRef.current.clientWidth
              setScrollDistance(textWidth - containerWidth)
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
          dangerouslySetInnerHTML={{ __html: msg }}
        />
      </AutoTextSize>
    </div>
  )
}
