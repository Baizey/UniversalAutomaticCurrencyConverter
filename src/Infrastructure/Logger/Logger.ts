import {DependencyProvider} from '../DependencyInjection';
import {useDebugLoggingSetting} from '../Configuration';

export interface ILogger {
    debug(message: string): void

    info(message: string): void

    warn(message: string): void

    error(error: Error, message?: string): void

    log(logEvent: LogEvent): void
}

export enum LogLevel {
    debug = 'debug',
    info = 'info',
    warn = 'warn',
    error = 'error',
}

type LogEvent = {
    logLevel: LogLevel.info | LogLevel.debug | LogLevel.warn
    message: string
} | {
    logLevel: LogLevel.error
    message?: string,
    error: Error
}

export class Logger implements ILogger {

    private readonly useLogging: useDebugLoggingSetting;
    private readonly startTime: number;

    constructor({useLogging}: DependencyProvider) {
        this.useLogging = useLogging;
        this.startTime = Date.now();
    }

    debug(message: string) {
        if (!this.useLogging.value) return;
        this._log(message, LogLevel.debug);
    }

    info(message: string) {
        if (!this.useLogging.value) return;
        this._log(message, LogLevel.info);
    }

    warn(message: string) {
        if (!this.useLogging.value) return;
        this._log(message, LogLevel.warn);
    }

    error(error: Error, message?: string) {
        // We always log errors, but if logging is off we warn that it is off
        if (!this.useLogging.value) this.warnLoggingTurnedOff()
        message = message || 'Unexpected error'
        this._log(`${message}\n${error.stack || error.message}`, LogLevel.error)
    }

    log(logEvent: LogEvent) {
        switch (logEvent.logLevel) {
            case LogLevel.debug:
                return this.debug(logEvent.message)
            case LogLevel.info:
                return this.info(logEvent.message)
            case LogLevel.warn:
                return this.warn(logEvent.message)
            case LogLevel.error:
                return this.error(logEvent.error, logEvent.message)
        }
    }

    private warnLoggingTurnedOff() {
        this._log(`Debug logging is turned off, turn it on for more information in settings`, LogLevel.warn)
    }

    private timestamp(): string {
        let runtime = Date.now() - this.startTime;

        const milliseconds = String(runtime % 1000).padEnd(3, '0');

        runtime = Math.floor(runtime / 1000)

        const seconds = String(runtime % 60).padStart(2, '0');

        runtime = Math.floor(runtime / 60)

        const minutes = String(runtime % 60).padStart(2, '0');

        runtime = Math.floor(runtime / 60)

        const hours = runtime;

        return `${hours ? `${hours}:` : ''}${minutes}:${seconds}.${milliseconds}`;

    }

    private _log(message: string, level: LogLevel) {
        message = `[UACC ${this.timestamp()}] ${message}`
        switch (level) {
            case LogLevel.debug:
                return console.debug(message)
            case LogLevel.info:
                return console.info(message)
            case LogLevel.warn:
                return console.warn(message)
            case LogLevel.error:
                return console.error(message)
        }
    }

}