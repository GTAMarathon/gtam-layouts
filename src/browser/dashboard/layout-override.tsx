import type { GameLayouts } from '@gtam-layouts/types'
import { Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { useReplicant } from '@nodecg/react-hooks'
import { useMemo } from 'react'
import { defaultCode } from '../graphics/components/game-layouts/layouts'
import { render } from '../render'
import { DashboardThemeProvider } from './components/DashboardThemeProvider'

export function LayoutOverride() {
  const [availableGameLayouts] = useReplicant<GameLayouts>('gameLayouts')
  const [currentGameLayout, setCurrentGameLayout] = useReplicant<string>('currentGameLayout')

  const layoutOptions = useMemo(() => {
    if (availableGameLayouts) {
      return availableGameLayouts.map((option) => {
        return {
          label: option.name,
          value: option.code,
        }
      })
    }
    else {
      return []
    }
  }, [availableGameLayouts])

  return (
    <DashboardThemeProvider>
      <Container fixed>
        <FormControl>
          <FormLabel>Select layout override</FormLabel>
          <RadioGroup
            value={currentGameLayout || defaultCode}
            onChange={event => setCurrentGameLayout(event.target.value)}
          >
            {layoutOptions.map(option => (
              <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
            ))}
          </RadioGroup>
        </FormControl>
      </Container>

    </DashboardThemeProvider>
  )
}

render(<LayoutOverride />)
