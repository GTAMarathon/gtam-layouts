import type { RunData } from 'speedcontrol/types'

export class Helpers {
  public static formatPlayers(run: RunData) {
    return (
      run.teams
        .map(team => team.name || team.players.map(player => player.name).join(', '))
        .join(' vs. ') || 'No players'
    )
  }
}
