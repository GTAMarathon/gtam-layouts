import chalk from 'chalk'

export class TaggedLogger {
  constructor(private readonly tag: string) {
  }

  public log(...msg: Array<any>) {
    console.log(`${chalk.blue('[INFO]')} [${this.tag}]} `, ...msg)
  }

  public warn(...msg: Array<any>) {
    console.warn(`${chalk.yellow('[WARN]')} [${this.tag}] `, ...msg)
  }

  public error(...msg: Array<any>) {
    console.error(`${chalk.red('[ERROR]')} [${this.tag}] `, ...msg)
  }

  public debug(...msg: Array<any>) {
    console.debug(`${chalk.green('[DEBUG]')} [${this.tag}] `, ...msg)
  }
}
