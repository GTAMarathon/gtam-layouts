import { useReplicant } from '@nodecg/react-hooks'

function useCurrentObsScene() {
  const [currentOBSScene] = useReplicant<string>('currentOBSScene')

  return currentOBSScene ?? ''
}

export default useCurrentObsScene
