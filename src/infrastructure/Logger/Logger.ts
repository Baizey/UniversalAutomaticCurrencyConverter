import { Provider } from "../DependencyInjection";
import { useDebugLoggingSetting } from "../Configuration";
import { LoggingSettingType } from "../Configuration/Configuration";

export interface ILogger {
  debug(message: string): void;

  info(message: string): void;

  warn(message: string): void;

  error(error: Error, message?: string): void;

  log(logEvent: LogEvent): void;
}

export enum LogLevel {
  debug = "debug",
  info = "info",
  warn = "warn",
  error = "error",
}

type LogEvent = {
  logLevel: LogLevel.info | LogLevel.debug | LogLevel.warn
  message: string
} | {
  logLevel: LogLevel.error
  message?: string,
  error: Error
}

const LogLevelConversion = {
  ["nothing" as LoggingSettingType]: 0,
  ["error" as LoggingSettingType]: 1,
  ["info" as LoggingSettingType]: 2,
  ["debug" as LoggingSettingType]: 3
} as Record<LoggingSettingType, number>;

export class Logger implements ILogger {

  private readonly useLogging: useDebugLoggingSetting;
  private readonly startTime: number;
  private isFirstLog: boolean;

  constructor({ useLogging }: Provider) {
    this.isFirstLog = true;
    this.useLogging = useLogging;
    this.startTime = Date.now();
  }

  debug(message: string) {
    this._log(message, LogLevel.debug);
  }

  info(message: string) {
    this._log(message, LogLevel.info);
  }

  warn(message: string) {
    this._log(message, LogLevel.warn);
  }

  error(error: Error, message?: string) {
    message = message || "Unexpected error";
    this._log(`${message}\n${error.stack || error.message}`, LogLevel.error);
  }

  log(logEvent: LogEvent) {
    switch (logEvent.logLevel) {
      case LogLevel.debug:
        return this.debug(logEvent.message);
      case LogLevel.info:
        return this.info(logEvent.message);
      case LogLevel.warn:
        return this.warn(logEvent.message);
      case LogLevel.error:
        return this.error(logEvent.error, logEvent.message);
    }
  }

  private timestamp(): string {
    let runtime = Date.now() - this.startTime;

    const milliseconds = String(runtime % 1000).padEnd(3, "0");

    runtime = Math.floor(runtime / 1000);

    const seconds = String(runtime % 60).padStart(2, "0");

    runtime = Math.floor(runtime / 60);

    const minutes = String(runtime % 60).padStart(2, "0");

    runtime = Math.floor(runtime / 60);

    const hours = runtime;

    return `${hours ? `${hours}:` : ""}${minutes}:${seconds}.${milliseconds}`;

  }

  private _log(message: string, level: LogLevel) {
    if (this.isFirstLog) {
      this.isFirstLog = false;
      this._log(`LogLevel: ${this.useLogging.value}`, LogLevel.debug);
    }

    message = `[UACC ${this.timestamp()}] ${message}`;
    switch (level) {
      case LogLevel.debug:
        if (LogLevelConversion[this.useLogging.value] < LogLevelConversion["debug" as LoggingSettingType]) return;
        return console.debug(message);
      case LogLevel.info:
        if (LogLevelConversion[this.useLogging.value] < LogLevelConversion["info" as LoggingSettingType]) return;
        return console.info(message);
      case LogLevel.warn:
        if (LogLevelConversion[this.useLogging.value] < LogLevelConversion["error" as LoggingSettingType]) return;
        return console.warn(message);
      case LogLevel.error:
        if (LogLevelConversion[this.useLogging.value] < LogLevelConversion["error" as LoggingSettingType]) return;
        return console.error(message);
    }
  }

}