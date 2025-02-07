import type { CSSProperties } from 'react'
import type { Timer } from 'speedcontrol/types'
import { useReplicant } from '@nodecg/react-hooks'
import { AutoTextSize } from 'auto-text-size'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import useCurrentRun from '../../../hooks/useCurrentRun'

interface Props {
  size: number
  team: number
  style?: CSSProperties
}

export function Player({ size = 64, team = 1, style }: Props) {
  const currentRun = useCurrentRun()
  const [timer] = useReplicant<Timer>('timer', { bundle: 'nodecg-speedcontrol' })

  let timeout = 0
  const teamI = useRef(0)
  const index = useRef(0)
  const [name, setName] = useState<string | null>(null)
  const nameRef = useRef(null)

  const showNextName = () => {
    if (currentRun && currentRun.teams[teamI.current]) {
      const team = currentRun.teams[teamI.current]

      setName(team?.players[index.current]?.name ?? '')
      timeout = window.setTimeout(() => showNextName(), 30 * 1000)
      index.current = (team?.players ?? []).length <= index.current + 1 ? 0 : index.current + 1
    }
  }

  useEffect(() => {
    window.clearTimeout(timeout)
    teamI.current = team - 1
    index.current = 0
    setName(null)
    const coop = !!(currentRun && currentRun.teams.length === 1 && currentRun.teams[0] && currentRun.teams[0].players.length >= 2)

    if (coop && currentRun.teams[0] && currentRun.teams[0].players[teamI.current]) {
      setName(currentRun.teams[0].players[teamI.current]!.name)
    }
    else if (!coop && currentRun && currentRun.teams[0] && currentRun.teams[0].players[teamI.current]) {
      showNextName()
    }
  }, [currentRun])

  const finishTime = useMemo(() => {
    if (currentRun && timer) {
      if (currentRun.teams.length <= 1) {
        return undefined
      }
      else {
        const teamId = currentRun.teams[teamI.current]?.id
        if (teamId) {
          const teamFinishTime
                = timer.teamFinishTimes[teamId]
          if (teamFinishTime) {
            if (teamFinishTime.state === 'completed') {
              return timer.teamFinishTimes[teamId]?.time
            }
            else {
              return 'Forfeit'
            }
          }
          else {
            return undefined
          }
        }
        else {
          return undefined
        }
      }
    }
    else {
      return undefined
    }
  }, [timer, currentRun])

  return (
    <div style={{ position: 'fixed', ...style }}>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={name}
          nodeRef={nameRef}
          in
          appear
          timeout={1000}
          classNames="fade"
        >
          {name && (
            <div
              className="Flex"
              ref={nameRef}
              style={{
                position: 'absolute',
                fontSize: '1.5em',
              }}
            >
              <AutoTextSize
                maxFontSizePx={size}
                as="div"
                style={{
                  marginLeft: '5px',
                  fontSize: '1.3em',
                }}
              >
                {name}
                {finishTime && (
                  <span style={{ fontSize: '0.75em' }}>
                    [
                    {finishTime}
                    ]
                  </span>
                )}
              </AutoTextSize>
            </div>
          )}
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}
