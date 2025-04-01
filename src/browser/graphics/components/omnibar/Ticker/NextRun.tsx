import type { RunData } from 'speedcontrol/types'
import type { RunDataActiveRunSurrounding } from 'speedcontrol/types/schemas'
import { AutoTextSize } from 'auto-text-size'
import { motion } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Helpers } from '../../../../helpers'

const runDataArray = nodecg.Replicant<RunData[]>(
  'runDataArray',
  'nodecg-speedcontrol',
)
const runDataActiveRunSurrounding = nodecg.Replicant <RunDataActiveRunSurrounding>(
  'runDataActiveRunSurrounding',
  'nodecg-speedcontrol',
)

function getNextRun() {
  return (runDataArray.value ?? []).find(run => run.id === runDataActiveRunSurrounding.value?.next)
}

interface Props {
  time: number
  onEnd: () => void
  onScrollingNeeded?: (needsScrolling: boolean) => void
  containerRef: React.RefObject<HTMLDivElement>
}

export function NextRun({ time, onEnd, containerRef, onScrollingNeeded }: Props) {
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
    NodeCG.waitForReplicants(runDataArray, runDataActiveRunSurrounding).then(() => {
      const nextRun = getNextRun()
      if (nextRun) {
        const timeToRun = Helpers.timeToRun(nextRun)
        if (timeToRun.length > 0) {
          setMsg(
            `Next run in <span class="highlight">${timeToRun}</span> - ${nextRun.customData['gameShort'] ?? nextRun.game} ${nextRun.category} by <span class="highlight">${Helpers.formatPlayers(nextRun)}</span>`,
          )
        }
        else {
          setMsg(
            `Next run - ${nextRun.customData['gameShort'] ?? nextRun.game} ${nextRun.category} by <span class="highlight">${Helpers.formatPlayers(nextRun)}</span>`,
          )
        }
      }
      else {
        onEnd()
      }
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
      key={`next-run-${forceKey}`}
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
