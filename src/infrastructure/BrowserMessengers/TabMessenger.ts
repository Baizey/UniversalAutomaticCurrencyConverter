import {Browser, BrowserDiTypes} from '../index'

export enum TabMessageType {
    openContextMenu,
}

export type TabMessage =
    { type: TabMessageType.openContextMenu }

type ResponseWrap<T> = { success: true, data: T } | { success: false, data: string }

export class TabMessenger {
    private browser: Browser

    constructor({browser}: BrowserDiTypes) {
        this.browser = browser
    }

    openContextMenu(): Promise<void> {
        return this.sendMessage({type: TabMessageType.openContextMenu})
    }

    private sendMessage<Response>(data: TabMessage): Promise<Response> {
        return this.browser.isFirefox
            ? this.sendMessageFirefox(data)
            : this.sendMessageChrome(data)
    }

    private async sendMessageFirefox<Response>(data: TabMessage): Promise<Response> {
        const tabs = await this.browser.tabs.query({active: true, currentWindow: true})
        const tabId = tabs[0].id
        console.log(tabId + ": " + tabs[0].url)
        if (!tabId) throw new Error('No tab found')
        const resp: ResponseWrap<Response> = await this.browser.tabs.sendMessage(tabId, data)
        if (!resp) throw new Error('No response')
        if (!resp.success) throw new Error(resp.data)
        return resp.data
    }

    private sendMessageChrome<Response>(data: TabMessage): Promise<Response> {
        const self = this
        return new Promise((resolve, reject) => {
            try {
                this.browser.tabs.query(
                    {
                        active: true,
                        currentWindow: true,
                    },
                    function (tabs: any[]) {
                        return self.browser.tabs.sendMessage(
                            tabs[0].id,
                            data,
                            function (resp: { success: boolean; data: Response }) {
                                if (!resp) return reject('No response')
                                return resp.success
                                    ? resolve(resp.data)
                                    : reject(resp.data)
                            },
                        )
                    },
                )
            } catch (e) {
                reject(e)
            }
        })
    }
}
