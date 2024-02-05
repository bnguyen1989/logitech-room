class LogEvent {
  public message: string;
  public data: object;
  public time: number = new Date().getTime();

  constructor(massage: string, data: object) {
    this.message = massage;
    this.data = data;
  }
}

export class Logger {
  public logs: Array<LogEvent> = new Array<LogEvent>();

  public log(message: string, data: object): void {
    this.logs.push(new LogEvent(message, data));
  }
}