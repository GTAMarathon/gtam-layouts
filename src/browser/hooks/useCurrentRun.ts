import type { RunDataArray } from 'speedcontrol/types'
import type { RunDataActiveRunSurrounding } from 'speedcontrol/types/schemas'
import { useReplicant } from '@nodecg/react-hooks'

function useCurrentRun() {
  const [runDataActiveRunSurroundingRep]
    = useReplicant<RunDataActiveRunSurrounding>('runDataActiveRunSurrounding', {
      bundle: 'nodecg-speedcontrol',
    })
  const [runDataArrayRep] = useReplicant<RunDataArray>('runDataArray', {
    bundle: 'nodecg-speedcontrol',
  })

  return (runDataArrayRep ?? []).find(
    run => run.id === runDataActiveRunSurroundingRep?.current,
  )
}

export default useCurrentRun
