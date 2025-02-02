import type { GameLayouts } from '@gtam-layouts/types'
import type { ChangeEvent } from 'react'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { useReplicant } from '@nodecg/react-hooks'
import { useMemo } from 'react'
import { render } from '../render'
import { DashboardThemeProvider } from './components/DashboardThemeProvider'

export function LayoutOverride() {
  const [gameLayouts, setGameLayouts] = useReplicant<GameLayouts>('gameLayouts', { bundle: 'gtam-layouts' })

  const layoutOptions = useMemo(() => {
    if (gameLayouts && gameLayouts.available) {
      return gameLayouts.available.map((option) => {
        return {
          label: option.name,
          value: option.code,
        }
      })
    }
    else {
      return []
    }
  }, [gameLayouts])

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = (event.target as HTMLInputElement).value
    if (gameLayouts) {
      setGameLayouts(prevState => ({ ...prevState, selected: newValue }))
    }
  }

  return (
    <DashboardThemeProvider>
      <FormControl>
        <FormLabel>Select layout override</FormLabel>
        <RadioGroup value={gameLayouts?.selected} onChange={handleRadioChange}>
          {layoutOptions.map(option => (
            <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
          ))}
        </RadioGroup>
      </FormControl>
    </DashboardThemeProvider>
  )
}

render(<LayoutOverride />)
