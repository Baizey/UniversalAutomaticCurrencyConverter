import {IBrowser} from "../index";
import {DependencyProvider} from '../DependencyInjection/DependencyInjector';

export enum PopupMessageType {
}

export type PopupMessage = {}

export interface IPopupMessenger {
}

export class PopupMessenger implements IPopupMessenger {
    private browser: IBrowser;

    constructor(browser: IBrowser) {
        this.browser = browser;
    }

    private sendMessage<Response>(data: PopupMessage): Promise<Response> {
        const access = this.browser.access;
        return new Promise((resolve, reject) => {
            try {
                access.runtime.sendMessage(data, (resp: { success: boolean, data: Response }) => {
                    if (!resp) return reject('No response');
                    resp.success ? resolve(resp.data) : reject(resp.data)
                })
            } catch (e) {
                reject(e);
            }
        });
    }
}