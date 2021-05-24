import {IBrowser} from "../index";

export enum TabMessageType {
    openContextMenu
}

export type TabMessage = {
    type: TabMessageType.openContextMenu
}

export interface ITabMessenger {
    openContextMenu(): Promise<void>
}

export class TabMessenger implements ITabMessenger {
    private browser: IBrowser;

    constructor(browser: IBrowser) {
        this.browser = browser;
    }

    openContextMenu(): Promise<void> {
        return this.sendMessage<void>({type: TabMessageType.openContextMenu})
    }

    private sendMessage<Response>(data: TabMessage): Promise<Response> {
        const self = this;
        return new Promise((resolve, reject) => {
            try {
                this.browser.tabs.query({
                    active: true,
                    currentWindow: true
                }, function (tabs: any[]) {
                    return self.browser.tabs.sendMessage(tabs[0].id, data, function (resp: { success: boolean, data: Response }) {
                        if (!resp) return reject('No response');
                        return resp.success ? resolve(resp.data) : reject(resp.data);
                    });
                })
            } catch (e) {
                reject(e);
            }
        })
    }
}