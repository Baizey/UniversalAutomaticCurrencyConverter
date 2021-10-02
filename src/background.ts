// This file is ran as a background script
import {BackgroundMessage, BackgroundMessageType, useProvider} from "./infrastructure";

function isCurrencyTag(value: any): boolean {
    return ((typeof value) === 'string') && /^[A-Z]{3}$/.test(value);
}

enum ContextMenuItem {
    openContextMenu = 'open-context-menu'
}

(async () => {
    const apiFetch = (
        path: string,
        init: {
            method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
            body?: any,
            headers?: Record<string, string>,
            params?: Record<string, string>
        } = {}
    ): Promise<Response> => {
        if (path.startsWith('/')) path = path.substr(1, path.length)
        if (init.params) path += '?' + Object.entries(init.params)
            .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
            .join('&')
        return fetch(`https://uacc-bff-api.azurewebsites.net/api/${path}`, {
            method: init?.method || 'GET',
            body: init.body ? JSON.stringify(init.body) : undefined,
            headers: {
                ...(init.headers || {}),
                'x-apikey': 'a8685f3f-9955-4d80-bff8-a927be128ece'
            }
        })
    }

    const {browser, logger, useLogging, lastVersion} = useProvider()
    await useLogging.loadSetting();
    logger.info('Initializing background');

    // Force open options if updating to new major version
    lastVersion.loadSetting().then(() => {
        const current = browser.extensionVersion.split('.').map(e => +e)[0]
        const last = lastVersion.value.split('.').map(e => +e)[0]
        if (last < current) browser.tabs.create({url: "options.html"});
    })

    try {
        browser.contextMenus.create({
            id: ContextMenuItem.openContextMenu,
            title: `Open context menu...`,
            contexts: ["page", "link", "image", "browser_action", "video", "audio", "editable", "page_action", "selection"]
        });

        browser.contextMenus.onClicked.addListener(function (info, tab) {
            switch (info.menuItemId) {
                case ContextMenuItem.openContextMenu:
                    browser.tab.openContextMenu()
                    break;
            }
        });
    } catch (err: unknown) {
        // Mostly happens if the context menu item already exists
        logger.error(err as Error)
    }

    browser.runtime.onMessage.addListener(function (request: BackgroundMessage, sender, senderResponse): boolean {
        function success(data: any): boolean {
            logger.info(`success: true, response: ${JSON.stringify(data)}`)
            senderResponse({success: true, data: data})
            return true;
        }

        function failure(message: string | Error): boolean {
            if (message instanceof Error) logger.error(message)
            logger.info(`success: false, response: ${JSON.stringify(message)}`)
            senderResponse({success: false, data: message})
            return true;
        }

        if (!request) return failure(`No request received`)

        switch (request.type) {
            case BackgroundMessageType.getRate:
                logger.info(`getRate ${request.from} => ${request.to}`)
                if (!isCurrencyTag(request.to) || !isCurrencyTag(request.from))
                    return failure(`Invalid currency tags given (${request.from}, ${request.to})`)
                if (request.from === request.to) return success(1)
                apiFetch(`v4/rate/${request.from}/${request.to}`)
                    .then(async resp => {
                        const text: string = await resp.text()
                        logger.info(`Fetching rate ${request.from} => ${request.to} = ${resp.statusText}\n${text}`);
                        return JSON.parse(text);
                    })
                    .then(resp => success(resp))
                    .catch(err => failure(err))
                break;
            case BackgroundMessageType.getSymbols:
                logger.info('getSymbols')
                apiFetch(`v4/symbols`)
                    .then(async resp => {
                        const text: string = await resp.text()
                        logger.info(`Fetching symbols ${resp.statusText}\n${text}`);
                        return JSON.parse(text);
                    })
                    .then(resp => success(resp))
                    .catch(err => failure(err))
                break;
        }

        return true;
    });
})()
    .catch(err => {
        const {logger} = useProvider()
        logger.error(err)
    })