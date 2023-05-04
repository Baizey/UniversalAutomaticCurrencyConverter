// This file is run as a background script
import {log, useProvider} from '../di'
import {BackgroundMessage, BackgroundMessageType} from '../infrastructure'
import {isCurrencyTag} from "./utils";
import {ContextMenuItem} from "./contextMenuItem";
import {RateApi} from "./RateApi";

async function loadSettings() {
    const {
        metaConfig: {lastVersion, logging},
    } = useProvider()
    await Promise.all([
        lastVersion.loadSetting(),
        logging.loadSetting()
    ])
}

async function handleVersionCheck() {
    const {
        browser,
        metaConfig: {lastVersion},
    } = useProvider()
    // Force open options if updating to a new major version
    const current = browser.extensionVersion.split('.').map((e) => +e)[0]
    const last = lastVersion.value.split('.').map((e) => +e)[0]
    if (last < current) await browser.tabs.create({url: 'options.html'})
}

async function handleContextMenuCreation() {
    useProvider().browser.contextMenus.create({
        id: ContextMenuItem.openContextMenu,
        title: `Open context menu...`,
        contexts: ['all',],
        onclick: (info, tab) => useProvider().tabMessenger.openContextMenu(tab.id)
    })
}

export const run = async () => {
    const {
        browser,
    } = useProvider()
    await loadSettings()
    log.info('Initializing background')
    await handleVersionCheck()
    await handleContextMenuCreation()

    browser.runtime.onMessage.addListener(function (
        request: BackgroundMessage,
        sender,
        senderResponse,
    ): boolean {
        function success(data: any): boolean {
            log.info(`success: true, response: ${JSON.stringify(data)}`)
            senderResponse({
                success: true,
                data: data,
            })
            return true
        }

        function failure(message: string | Error): boolean {
            if (message instanceof Error) log.error(message)
            log.info(`success: false, response: ${JSON.stringify(message)}`)
            senderResponse({
                success: false,
                data: message,
            })
            return true
        }

        if (!request) return failure(`No request received`)

        switch (request.type) {
            case BackgroundMessageType.getRate:
                log.info(`getRate ${request.from} => ${request.to}`)
                if (!isCurrencyTag(request.to) || !isCurrencyTag(request.from)) {
                    return failure(
                        `Invalid currency tags given (${request.from}, ${request.to})`,
                    )
                }
                if (request.from === request.to) return success(1)
                RateApi.fetch(`v4/rate/${request.from}/${request.to}`)
                    .then(async (resp) => {
                        const text: string = await resp.text()
                        log.info(
                            `Fetching rate ${request.from} => ${request.to} = ${resp.statusText}\n${text}`,
                        )
                        return JSON.parse(text)
                    })
                    .then(success)
                    .catch(failure)
                break
            case BackgroundMessageType.getSymbols:
                log.info('getSymbols')
                RateApi.fetch(`v4/symbols`)
                    .then(async (resp) => {
                        const text: string = await resp.text()
                        log.info(`Fetching symbols ${resp.statusText}\n${text}`)
                        return JSON.parse(text)
                    })
                    .then(success)
                    .catch(failure)
                break
        }

        return true
    })
}
