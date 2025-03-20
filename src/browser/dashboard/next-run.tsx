import type { Timer } from 'speedcontrol/types'
import { Alert, Button, Stack } from '@mui/material'
import { useReplicant } from '@nodecg/react-hooks'
import { useEffect, useMemo, useState } from 'react'
import useCurrentObsScene from '../hooks/useCurrentOBSScene'
import useNextRun from '../hooks/useNextRun'
import { render } from '../render'
import { DashboardThemeProvider } from './components/DashboardThemeProvider'

const intermissionSceneName = nodecg.bundleConfig.obs.names.scenes.intermission

export function NextRun() {
  const currentObsScene = useCurrentObsScene()
  const [timer] = useReplicant<Timer | undefined>('timer', {
    bundle: 'nodecg-speedcontrol',
  })
  const [nextRunGameName, setNextRunGameName] = useState<string>('')
  const nextRun = useNextRun()

  const getNextRunGameName = useMemo(() => {
    if (nextRun && nextRun.game) {
      return `${nextRun.game.slice(0, 35)}${nextRun.game.length > 35 ? '...' : ''}`
    }
    return '(Run with no name)'
  }, [nextRun])

  useEffect(() => {
    setNextRunGameName(getNextRunGameName)
  }, [nextRun])

  const disableChange
    = (timer && ['running', 'paused'].includes(timer.state))
      || currentObsScene === intermissionSceneName

  return (
    <DashboardThemeProvider>
      <Stack spacing={2}>
        <Button
          variant="contained"
          disabled={disableChange || !nextRun}
          onClick={() => {
            if (nextRun) {
              nodecg.sendMessage('switchToIntermission')
            }
          }}
        >
          <span>
            {nextRun ? <>{nextRunGameName}</> : nextRun ? <>No next runs</> : <>No added runs</>}
          </span>
        </Button>
        {disableChange && <Alert severity="info">You cannot change the game right now.</Alert>}
      </Stack>
    </DashboardThemeProvider>
  )
}

render(<NextRun />)
