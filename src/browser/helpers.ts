import type { RunData } from 'speedcontrol/types'
import humanizeDuration from 'humanize-duration'

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

  public static timeToRun(run: RunData): string {
    let value = ''

    if (run.scheduledS) {
      const now = Math.floor(Date.now() / 1000)
      const timerS = run.scheduledS - now
      if (timerS > 30) {
        const roundedS = this.customizedRounding(timerS)
        value = humanizeDuration(roundedS * 1000, {
          language: 'en',
          conjunction: ' and ',
          serialComma: false,
          units: ['d', 'h', 'm'],
        })
      }
    }
    return value
  }

  private static customizedRounding(time: number): number {
    let rounded: number
    if (time < 300) {
      rounded = Math.round(time / 60) * 60
    }
    else if (time < 3600) {
      rounded = Math.round(time / 300) * 300
    }
    else if (time < 7200) {
      const round10 = Math.round(time / 600) * 600
      const round15 = Math.round(time / 900) * 900
      rounded
        = Math.abs(round10 - time) < Math.abs(round15 - time) ? round10 : round15
    }
    else if (time < 14400) {
      rounded = Math.round(time / 900) * 900
    }
    else if (time < 21600) {
      rounded = Math.round(time / 1800) * 1800
    }
    else {
      rounded = Math.round(time / 3600) * 3600
    }
    return rounded
  }
}
