import chalk from 'chalk'
import { get } from './nodecg'

export class TaggedLogger {
  private readonly nodecg = get()

  constructor(private readonly tag: string) {
  }

  public log(...msg: Array<any>) {
    console.log(`${chalk.blue('[INFO]')} [${this.tag}]`, ...msg)
  }

  public warn(...msg: Array<any>) {
    console.warn(`${chalk.yellow('[WARN]')} [${this.tag}]`, ...msg)
  }

  public error(...msg: Array<any>) {
    console.error(`${chalk.red('[ERROR]')} [${this.tag}]`, ...msg)
  }

  public debug(...msg: Array<any>) {
    if (this.nodecg.config.logging.console.level === 'debug') {
      console.debug(`${chalk.green('[DEBUG]')} [${this.tag}]`, ...msg)
    }
  }
}
