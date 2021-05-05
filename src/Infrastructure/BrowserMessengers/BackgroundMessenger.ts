import {IBrowser} from "../index";
import {DependencyProvider} from '../DependencyInjection/DependencyInjector';

export enum BackgroundMessageType {
    getRate,
    getSymbols,
}

export type BackgroundMessage = {
    type: BackgroundMessageType.getSymbols
} | {
    type: BackgroundMessageType.getRate, from: string, to: string
}

export interface IBackgroundMessenger {
    getRate(from: string, to: string): Promise<{ rate: number }>

    getSymbols(): Promise<{ [key: string]: string }>
}

export class BackgroundMessenger implements IBackgroundMessenger {
    private browser: IBrowser;

    constructor(browser: IBrowser) {
        this.browser = browser;
    }

    getRate(from: string, to: string): Promise<{ rate: number }> {
        return this.sendMessage<{ rate: number }>({type: BackgroundMessageType.getRate, to: to, from: from})
    }

    getSymbols(): Promise<{ [key: string]: string }> {
        return this.sendMessage<Record<string, string>>({type: BackgroundMessageType.getSymbols})
    }

    private sendMessage<Response>(data: BackgroundMessage): Promise<Response> {
        const access = this.browser.access;
        return new Promise((resolve, reject) => {
            try {
                access.runtime.sendMessage(data, function (resp: { success: boolean, data: Response }) {
                    if(!resp) return reject('No response');
                    return resp.success ? resolve(resp.data) : reject(resp.data);
                })
            } catch (e) {
                reject(e);
            }
        });
    }
}