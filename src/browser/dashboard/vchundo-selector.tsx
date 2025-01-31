import type { RunDataTeam } from 'speedcontrol/types'
import { Button, Container } from '@mui/material'
import { useMemo, useState } from 'react'
import useCurrentRun from '../hooks/useCurrentRun'
import { render } from '../render'
import { DashboardThemeProvider } from './components/DashboardThemeProvider'

interface Model {
  feedNumber: number | undefined
  feed1: RunDataTeam | undefined
  feed2: RunDataTeam | undefined
  feed3: RunDataTeam | undefined
  feed4: RunDataTeam | undefined
  feed5: RunDataTeam | undefined
}

export function VCHundoSelector() {
  const currentRun = useCurrentRun()

  const [model, setModel] = useState<Model>({
    feedNumber: undefined,
    feed1: undefined,
    feed2: undefined,
    feed3: undefined,
    feed4: undefined,
    feed5: undefined,
  })

  const availableRunners = useMemo(
    () =>
      (currentRun?.teams ?? []).filter(
        team =>
          team !== model.feed1
          && team !== model.feed2
          && team !== model.feed3
          && team !== model.feed4
          && team !== model.feed5,
      ),
    [currentRun, model],
  )

  const disableSend = useMemo(
    () =>
      model.feed1 === undefined
      || model.feed2 === undefined
      || model.feed3 === undefined
      || model.feed4 === undefined
      || model.feed5 === undefined,
    [model],
  )

  const assignRunner = (team: RunDataTeam) => {
    if (!model.feedNumber)
      return

    setModel(prev => ({
      ...prev,
      [`feed${prev.feedNumber}`]: team,
      feedNumber: undefined,
    }))
  }

  const selectFeed = (feedNumber: number) => {
    setModel(prev => ({ ...prev, feedNumber }))
  }

  const send = () => {
    const data = {
      feed1: model.feed1,
      feed2: model.feed2,
      feed3: model.feed3,
      feed4: model.feed4,
      feed5: model.feed5,
    }

    nodecg
      .sendMessage('changeRunnersOnVCHundo', data)
      .then(() => {})
      .catch(() => {})

    setModel({ ...model, feed1: undefined, feed2: undefined, feed3: undefined, feed4: undefined, feed5: undefined })
  }

  const cancel = () => {
    setModel({
      feedNumber: undefined,
      feed1: undefined,
      feed2: undefined,
      feed3: undefined,
      feed4: undefined,
      feed5: undefined,
    })
  }

  return (
    <DashboardThemeProvider>
      <Container>
        {!model.feedNumber
          ? (
              [1, 2, 3, 4, 5].map(num => (
                <Button
                  key={num}
                  disabled={model[`feed${num}` as keyof Model] !== undefined}
                  onClick={() => selectFeed(num)}
                  style={{ marginRight: '5px' }}
                >
                  Feed
                  {' '}
                  {num}
                </Button>
              ))
            )
          : (
              <Button variant="contained" disabled>
                Feed
                {model.feedNumber}
              </Button>
            )}
      </Container>
      <Container>
        {model.feedNumber && (
          <div>
            {availableRunners.map(runner => (
              <Button
                key={runner.id}
                onClick={() => assignRunner(runner)}
                style={{ marginTop: '5px', marginRight: '5px' }}
              >
                {runner.players[0]?.name}
              </Button>
            ))}
          </div>
        )}
      </Container>
      <Container>
        {' '}
        <Button
          disabled={disableSend}
          onClick={send}
          style={{ marginTop: '5px', marginRight: '5px' }}
        >
          SEND
        </Button>
        <Button
          disabled={model.feedNumber !== undefined}
          onClick={cancel}
          style={{ marginTop: '5px', marginRight: '5px' }}
        >
          CANCEL
        </Button>
      </Container>
    </DashboardThemeProvider>
  )
}

render(<VCHundoSelector />)
