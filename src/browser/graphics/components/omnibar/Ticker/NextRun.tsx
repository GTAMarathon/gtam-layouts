import type { RunData } from 'speedcontrol/types'
import type { RunDataActiveRunSurrounding } from 'speedcontrol/types/schemas'
import { useLayoutEffect, useState } from 'react'
import { Helpers } from '../../../../helpers'

const runDataArray = nodecg.Replicant<RunData[]>(
  'runDataArray',
  'nodecg-speedcontrol',
)
const runDataActiveRunSurrounding = nodecg.Replicant <RunDataActiveRunSurrounding>(
  'runDataActiveRunSurrounding',
  'nodecg-speedcontrol',
)

function getNextRun() {
  return (runDataArray.value ?? []).find(run => run.id === runDataActiveRunSurrounding.value?.next)
}

interface Props {
  time: number
  onEnd: () => void
}

export function NextRun({ time, onEnd }: Props) {
  const [msg, setMsg] = useState('')

  useLayoutEffect(() => {
    console.log('NextRun: Mounted')

    NodeCG.waitForReplicants(runDataArray, runDataActiveRunSurrounding).then(() => {
      const nextRun = getNextRun()
      if (nextRun) {
        const timeToRun = Helpers.timeToRun(nextRun)
        if (timeToRun.length > 0) {
          setMsg(
            `Next run in <span class="highlight">${timeToRun}</span> - ${nextRun.customData['gameShort'] ?? nextRun.game} ${nextRun.category} by <span class="highlight">${Helpers.formatPlayers(nextRun)}</span>`,
          )
        }
        else {
          setMsg(
            `Next run - ${nextRun.customData['gameShort'] ?? nextRun.game} ${nextRun.category} by <span class="highlight">${Helpers.formatPlayers(nextRun)}</span>`,
          )
        }
      }
      else {
        console.log('NextRun: End')
        onEnd()
      }
    })

    const exitTimeout = setTimeout(() => {
      console.log('NextRun: End')
      onEnd()
    }, time * 1000)

    return () => {
      clearTimeout(exitTimeout)
    }
  }, [])

  return (
    <div
      id="NextRun"
      style={{ fontSize: '40px' }}
      dangerouslySetInnerHTML={{ __html: msg }}
    />
  )
}
