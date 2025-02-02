import type { RunData } from 'speedcontrol/types'

export class Helpers {
  public static formatPlayers(run: RunData) {
    return (
      run.teams
        .map(team => team.name || team.players.map(player => player.name).join(', '))
        .join(' vs. ') || 'No players'
    )
  }

  public static formatPosition(i: number): string {
    if (i === 1) {
      return '1st'
    }
    else if (i === 2) {
      return '2nd'
    }
    else if (i === 3) {
      return '3rd'
    }
    else {
      return `${i}th`
    }
  }
}
