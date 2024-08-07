// This file is run as a background script
import {log, useProvider} from '../di'
import {ContextMenuItem} from "./contextMenuItem";

async function loadSettings() {
    const {browser} = useProvider()
    browser.setAsServiceWorker()
    const {config} = useProvider()
    await config.load()
    const {activeLocalization} = useProvider()
    await activeLocalization.load('<html lang="us-EN"></html>')
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
    const {browser, tabMessenger} = useProvider()
    browser.contextMenus.removeAll(() => {
        browser.contextMenus.create({
                id: ContextMenuItem.openContextMenu,
                title: `Open context menu...`,
                contexts: ['all',]
            },
            () => browser.contextMenus.onClicked.addListener((_, tab) => tabMessenger.openContextMenu(tab!.id)))
    })
}

async function handleMessengerRegistration() {
    const {backgroundHandlers} = useProvider()
    backgroundHandlers.listen()
}

let hasRun = false
export const startServiceWorker = async () => {
    if (hasRun) return
    await loadSettings()
    log.info('loadSettings')
    await handleVersionCheck()
    log.info('handleVersionCheck')
    await handleContextMenuCreation()
    log.info('handleContextMenuCreation')
    await handleMessengerRegistration()
    log.info('handleMessengerRegistration')
    hasRun = true
}
