// This file is ran as a background script
import {BackgroundMessage, BackgroundMessageType, useProvider} from "./infrastructure";

function isCurrencyTag(value: any): boolean {
    return ((typeof value) === 'string') && /^[A-Z]{3}$/.test(value);
}

enum ContextMenuItem {
    openContextMenu = 'open-context-menu'
}

(async () => {
    const {browser, logger, useLogging} = useProvider()
    await useLogging.loadSetting();
    logger.info('Initializing background');

    // For testing
    browser.tabs.create({url: "options.html"});

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

    browser.runtime.onMessage.addListener(function (request: BackgroundMessage, sender, senderResponse): boolean {
        function success(data: any): boolean {
            senderResponse({success: true, data: data})
            return true;
        }

        function failure(message: string | Error): boolean {
            if (message instanceof Error) logger.error(message)
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
                fetch(`https://uacc-bff-api.azurewebsites.net/api/v4/rate/${request.from}/${request.to}/a8685f3f-9955-4d80-bff8-a927be128ece`, {
                    headers: {
                        'Access-Control-Allow-Origin': 'https://uacc-bff-api.azurewebsites.net'
                    }
                })
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
                fetch(`https://uacc-bff-api.azurewebsites.net/api/v4/symbols/a8685f3f-9955-4d80-bff8-a927be128ece`, {
                    headers: {
                        'Access-Control-Allow-Origin': 'https://uacc-bff-api.azurewebsites.net'
                    }
                })
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