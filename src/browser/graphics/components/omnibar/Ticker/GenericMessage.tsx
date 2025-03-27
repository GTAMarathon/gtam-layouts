import { AutoTextSize } from 'auto-text-size'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface Props {
  message: string
  time: number
  onEnd: () => void
  onScrollingNeeded?: (needs: boolean) => void
}

export function GenericMessage({ message, time, onEnd, onScrollingNeeded }: Props) {
  const textRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollDistance, setScrollDistance] = useState(0)

  useEffect(() => {
    const updateScroll = () => {
      if (textRef.current && containerRef.current) {
        const textWidth = textRef.current.scrollWidth
        const containerWidth = containerRef.current.clientWidth
        const needsScroll = textWidth > containerWidth
        setScrollDistance(textWidth - containerWidth)
        onScrollingNeeded?.(needsScroll)
      }
    }

    const observer = new ResizeObserver(updateScroll)
    if (textRef.current)
      observer.observe(textRef.current)

    updateScroll()
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    console.log('GenericMessage: Mounted')
    const timeout = setTimeout(() => {
      console.log('GenericMessage: End')
      onEnd()
    }, time * 1000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div ref={containerRef} style={{ overflow: 'hidden', width: '100%' }}>
      <AutoTextSize
        maxFontSizePx={64}
        minFontSizePx={38}
        mode="box"
        style={{ display: 'inline-block' }}
      >
        <motion.div
          ref={textRef}
          animate={scrollDistance > 0 ? { x: [-scrollDistance, 0] } : {}}
          transition={{ duration: scrollDistance / 30, loop: Infinity }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </AutoTextSize>
    </div>
  )
}
