import type { Timer } from 'speedcontrol/types/schemas'
import { Alert, Button, Container } from '@mui/material'
import { useReplicant } from '@nodecg/react-hooks'
import { useEffect, useMemo, useState } from 'react'
import useCurrentRun from '../hooks/useCurrentRun'
import { render } from '../render'
import { DashboardThemeProvider } from './components/DashboardThemeProvider'

interface Player {
  name: string
  id: string
  teamID: string
  country?: string
  pronouns?: string
  social: {
    twitch?: string
  }
}

interface Stream {
  name: string
  twitchAccount: string
}

export function StreamAssign() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [streams, setStreams] = useState<Stream[]>([])
  const currentRun = useCurrentRun()
  const [timer] = useReplicant<Timer>('timer', { bundle: 'nodecg-speedcontrol' })

  useEffect(() => {
    const configStreams = nodecg.bundleConfig.feeds.streams as Stream[]
    setStreams(configStreams)
  }, [])

  const runners = useMemo<Player[]>(() => {
    const players: Player[] = []
    if (currentRun && currentRun.teams) {
      for (const team of currentRun.teams) {
        for (const player of team.players) {
          players.push(player)
        }
      }
    }
    return players
  }, [currentRun])

  const enableChange = useMemo(() => timer && timer.state ? !['running', 'paused'].includes(timer.state) : false, [timer])

  const assign = (stream: Stream) => {
    nodecg.sendMessage('assignStreamToRunner', {
      runner: selectedPlayer?.name,
      stream,
    })

    setSelectedPlayer(null)
  }

  return (
    <DashboardThemeProvider>
      <Container>
        {enableChange
          ? (
              <Container>
                {!selectedPlayer
                  ? (runners.map(runner => (
                      <Button variant="contained" key={runner.id} onClick={() => setSelectedPlayer(runner)}>{runner.name}</Button>
                    )))
                  : (<Button variant="contained" disabled>{selectedPlayer.name}</Button>)}
                {selectedPlayer && (
                  <Container>
                    {streams.map(stream => (
                      <Button key={stream.name} variant="contained" onClick={() => assign(stream)}>
                        {stream.name}
                        <br />
                        {stream.twitchAccount}
                      </Button>
                    ))}
                    <Button variant="contained" onClick={() => setSelectedPlayer(null)}>CANCEL</Button>
                  </Container>
                )}
              </Container>
            )
          : <Alert severity="info">Cannot change runners' feeds while the timer is running</Alert>}
      </Container>
    </DashboardThemeProvider>
  )
}

render(<StreamAssign />)
