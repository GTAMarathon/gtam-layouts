import type { GameLayouts } from '@gtam-layouts/types'
import { useReplicant } from '@nodecg/react-hooks'
import { useEffect, useRef, useState } from 'react'
import { render } from '../render'
import { defaultCode, layoutsList } from './components/game-layouts/layouts'

interface CurrentLayout {
  code: string
  component: JSX.Element
}

export function GameLayout() {
  const [gameLayouts, setGameLayouts] = useReplicant<GameLayouts>('gameLayouts')
  const [currentLayout, setCurrentLayout] = useState<CurrentLayout | null>(null)

  const setUpReplicant = useRef(false)

  useEffect(() => {
    if (!gameLayouts)
      return

    // Set up available game layouts list replicant when first loading the page
    if (!setUpReplicant.current) {
      const layouts = Object.values(layoutsList)
      setGameLayouts(prevState => ({
        ...prevState,
        available: layouts.map(({ name, code }) => ({ name, code })),
      }))
      setUpReplicant.current = true
    }

    const currentSelectedLayout = layoutsList[(gameLayouts.selected || defaultCode) as keyof typeof layoutsList]
    setCurrentLayout({ code: currentSelectedLayout.code, component: currentSelectedLayout.component() })
  }, [gameLayouts])

  return <div id="GameLayout">{currentLayout && <>{currentLayout.component}</>}</div>
}

render(<GameLayout />)
