import { Button, Container } from '@mui/material'
import { useMemo } from 'react'
import useCurrentRun from '../hooks/useCurrentRun'
import { render } from '../render'
import { DashboardThemeProvider } from './components/DashboardThemeProvider'

export function Focus() {
  const currentRun = useCurrentRun()

  const hasFourPlayersCoop = useMemo(() => {
    return currentRun && currentRun.teams && currentRun.teams.length === 1 && currentRun.teams[0] && currentRun.teams[0].players.length === 4
  }, [currentRun])

  const hasFourTeams = useMemo(() => {
    return currentRun && currentRun.teams && currentRun.teams.length === 4
  }, [currentRun])

  const hasFourPlayers = (hasFourTeams !== undefined && hasFourTeams === true) || (hasFourPlayersCoop !== undefined && hasFourPlayersCoop === true)

  const runner = (runnerNumber: number) => {
    if (hasFourPlayersCoop) {
      return currentRun?.teams[0]?.players[runnerNumber]?.name
    }
    else if (hasFourPlayers) {
      return currentRun?.teams[runnerNumber]?.players[0]?.name
    }
    else {
      return ''
    }
  }

  const focusOnRunner = (runnerNumber: number) => {
    nodecg.sendMessage('focusOnRunner', runnerNumber)
  }

  return (
    <DashboardThemeProvider>
      <Container>
        {hasFourPlayers && (
          <>
            <Button variant="contained" onClick={() => focusOnRunner(1)}>
              {runner(0)}
            </Button>
            <Button variant="contained" onClick={() => focusOnRunner(2)}>
              {runner(1)}
            </Button>
            <Button variant="contained" onClick={() => focusOnRunner(3)}>
              {runner(2)}
            </Button>
            <Button variant="contained" onClick={() => focusOnRunner(4)}>
              {runner(3)}
            </Button>
          </>
        )}
      </Container>
    </DashboardThemeProvider>
  )
}

render(<Focus />)
