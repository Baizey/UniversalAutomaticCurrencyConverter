import {IBrowser} from "../index";

export enum BackgroundMessageType {
    ActiveRightClick = 'activeRightClick',
    Rate = 'rate',
    Symbols = 'symbols',
    OpenPopup = 'openPopup'
}

export type BackgroundMessage = {
    type: BackgroundMessageType.ActiveRightClick | BackgroundMessageType.Symbols | BackgroundMessageType.OpenPopup
} | {
    type: BackgroundMessageType.Rate, from: string, to: string
}

export interface IBackgroundMessenger {
    activeRightClick(): Promise<void>

    getRate(from: string, to: string): Promise<number>

    getSymbols(): Promise<{ [key: string]: string }>

    openPopup(): Promise<void>
}

export class BackgroundMessenger implements IBackgroundMessenger {
    private browser: IBrowser;

    constructor(browser: IBrowser) {
        this.browser = browser;
    }

    private sendMessage<Response>(data: BackgroundMessage): Promise<Response> {
        const access = this.browser.access;
        return new Promise((resolve, reject) => {
            try {
                access.runtime.sendMessage(data, function (resp: { success: boolean, data: Response }) {
                    if (!resp) return reject('No response');
                    return resp.success ? resolve(resp.data) : reject(resp.data);
                })
            } catch (e) {
                reject(e);
            }
        });
    }

    activeRightClick(): Promise<void> {
        return this.sendMessage<void>({type: BackgroundMessageType.ActiveRightClick})
    }

    getRate(from: string, to: string): Promise<number> {
        return this.sendMessage<number>({type: BackgroundMessageType.Rate, to: to, from: from})
    }

    getSymbols(): Promise<{ [key: string]: string }> {
        return this.sendMessage<{ [key: string]: string }>({type: BackgroundMessageType.Symbols})
    }

    openPopup(): Promise<void> {
        return this.sendMessage<void>({type: BackgroundMessageType.OpenPopup})
    }
}