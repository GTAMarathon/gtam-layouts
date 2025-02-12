import type { HundoTrackerPlayer } from '@gtam-layouts/types'
import { Helpers } from '../../../../helpers'

interface Props {
  player: HundoTrackerPlayer | null
  position: number
}

export function PlayerCompletion({ player = null, position = 1 }: Props) {
  return (
    <>
      {player && (
        <th className="big" scope="col">
          <div className="table_pos"><b>{Helpers.formatPosition(position)}</b></div>
          <br />
          <div className="table_name">{player.name}</div>
          <br />
          <div className="table_score">
            <b>
              {player.score}
              %
            </b>
          </div>
        </th>
      )}
    </>
  )
}
