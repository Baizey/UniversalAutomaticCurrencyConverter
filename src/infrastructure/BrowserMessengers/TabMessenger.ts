import {Browser, BrowserDiTypes} from '../index'

export enum TabMessageType {
    openContextMenu,
}

export type TabMessage =
    { type: TabMessageType.openContextMenu, tabId?: number }

type ResponseWrap<T> = { success: true, data: T } | { success: false, data: string }

export class TabMessenger {
    private browser: Browser

    constructor({browser}: BrowserDiTypes) {
        this.browser = browser
    }

    openContextMenu(tabId?: number): Promise<void> {
        return this.sendMessage({type: TabMessageType.openContextMenu, tabId})
    }

    private async sendMessage<Response>(data: TabMessage): Promise<Response> {
        const tabId = await this.getTabId(data.tabId)
        if (!tabId) throw new Error('No tab found')

        const resp: ResponseWrap<Response> = await this.browser.tabs.sendMessage(tabId, data)
        if (!resp) throw new Error('No response')
        if (!resp.success) throw new Error(resp.data)
        return resp.data
    }

    private async getTabId(providedTabId?: number) {
        if (providedTabId) return providedTabId
        const tabs = await this.browser.tabs.query({active: true, currentWindow: true})
        return tabs[0].id
    }
}
