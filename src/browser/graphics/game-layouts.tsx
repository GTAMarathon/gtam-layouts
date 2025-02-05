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
  const [availableGameLayouts, setAvailableGameLayouts] = useReplicant<GameLayouts>('gameLayouts')
  const [currentGameLayout] = useReplicant<string>('currentGameLayout')
  const [currentLayout, setCurrentLayout] = useState<CurrentLayout | null>(null)

  const setUpReplicant = useRef(false)

  useEffect(() => {
    if (!availableGameLayouts)
      return

    // Set up available game layouts list replicant when first loading the page
    if (!setUpReplicant.current) {
      const layouts = Object.values(layoutsList).map(({ name, code }) => ({ name, code }))
      setAvailableGameLayouts(layouts)
      setUpReplicant.current = true
    }
  }, [availableGameLayouts, setAvailableGameLayouts])

  useEffect(() => {
    const currentSelectedLayout = layoutsList[(currentGameLayout || defaultCode) as keyof typeof layoutsList]
    setCurrentLayout({ code: currentSelectedLayout.code, component: currentSelectedLayout.component() })
  }, [currentGameLayout])

  return <div id="GameLayout">{currentLayout && <>{currentLayout.component}</>}</div>
}

render(<GameLayout />)
