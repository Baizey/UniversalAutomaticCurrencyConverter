import {IBrowser} from "../Browser";
import {DependencyProvider} from '../DependencyInjection';

export interface ILogger {
    debug(message: string): void

    info(message: string): void

    warning(message: string): void

    error(error: Error, message?: string): void
}


export class Logger implements ILogger {
    private browser: IBrowser;

    constructor({browser}: DependencyProvider) {
        this.browser = browser;
    }

    debug(message: string) {
        if (this.browser.isDevelopment)
            console.log(`[UACC DEB] ${message}`);
    }

    info(message: string) {
        console.log(`[UACC INF] ${message}`);
    }

    warning(message: string) {
        console.log(`[UACC WAR] ${message}`);
    }

    error(error: Error, message?: string) {
        message = message || 'Unexpected error'
        console.log(`[UACC ERR] ${message}, ${error.stack}`);
    }

}