import chalk from 'chalk'
import { get } from './nodecg'
import dayjs from 'dayjs'

export class TaggedLogger {
  private readonly nodecg = get()

  constructor(private readonly tag: string) {
  }

  private getTimestamp(): string {
    return dayjs().format('YYYY-MM-DD HH:mm:ss')
  }

  public log(...msg: Array<any>) {
    console.log(`${this.getTimestamp()} - ${chalk.blue('[INFO]')} [${this.tag}]`, ...msg)
  }

  public warn(...msg: Array<any>) {
    console.warn(`${this.getTimestamp()} - ${chalk.yellow('[WARN]')} [${this.tag}]`, ...msg)
  }

  public error(...msg: Array<any>) {
    console.error(`${this.getTimestamp()} - ${chalk.red('[ERROR]')} [${this.tag}]`, ...msg)
  }

  public debug(...msg: Array<any>) {
    if (this.nodecg.config.logging.console.level === 'debug') {
      console.debug(`${this.getTimestamp()} - ${chalk.green('[DEBUG]')} [${this.tag}]`, ...msg)
    }
  }
}
