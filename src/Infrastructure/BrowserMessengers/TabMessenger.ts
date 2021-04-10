import {IBrowser} from "../index";

export enum TabMessageType {
    SelectedMenu = 'selectedMenu',
    ContextMenu = 'contextMenu',
    ShowConversions = 'showConversions',
    HideConversions = 'hideConversions',
    GetHref = 'getHref',
    SetActiveLocalizations = 'setActiveLocalization',
}

export type TabMessage = {
    type: TabMessageType.SelectedMenu
        | TabMessageType.ContextMenu
        | TabMessageType.ShowConversions
        | TabMessageType.HideConversions
        | TabMessageType.GetHref
} | {
    type: TabMessageType.SetActiveLocalizations,
    localizations: { krone: string, asian: string, dollar: string }
}

export interface ITabMessenger {
    selectedMenu(): Promise<void>

    contextMenu(): Promise<void>

    showConversions(): Promise<void>

    hideConversions(): Promise<void>

    getHref(): Promise<string>

    setLocalization(data: { dollar: string, asian: string, krone: string }): Promise<void>
}

export class TabMessenger implements ITabMessenger {
    private browser: IBrowser;

    constructor(browser: IBrowser) {
        this.browser = browser;
    }

    private sendMessage<Response>(data: TabMessage): Promise<Response> {
        const access = this.browser.access;
        return new Promise((resolve, reject) => {
            try {
                access.tabs.query({
                    active: true,
                    currentWindow: true
                }, function (tabs: any[]) {
                    return access.tabs.sendMessage(tabs[0].id, data, function (resp: { success: boolean, data: Response }) {
                        if (!resp) return reject('No response');
                        return resp.success ? resolve(resp.data) : reject(resp.data);
                    });
                })
            } catch (e) {
                reject(e);
            }
        })
    }

    contextMenu(): Promise<void> {
        return this.sendMessage<void>({type: TabMessageType.ContextMenu})
    }

    getHref(): Promise<string> {
        return this.sendMessage<string>({type: TabMessageType.GetHref})
    }

    selectedMenu(): Promise<void> {
        return this.sendMessage<void>({type: TabMessageType.SelectedMenu})
    }

    setLocalization(data: { dollar: string; asian: string; krone: string }): Promise<void> {
        return this.sendMessage<void>({type: TabMessageType.SetActiveLocalizations, localizations: data})
    }

    hideConversions(): Promise<void> {
        return this.sendMessage<void>({type: TabMessageType.HideConversions})
    }

    showConversions(): Promise<void> {
        return this.sendMessage<void>({type: TabMessageType.ShowConversions})
    }
}