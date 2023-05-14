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
    try {
        useProvider().browser.contextMenus.create({
            id: ContextMenuItem.openContextMenu,
            title: `Open context menu...`,
            contexts: ['all',]
        })
    } catch (e) {
    }
    try {
        useProvider().browser.contextMenus.onClicked.addListener(
            (info, tab) => useProvider().tabMessenger.openContextMenu(tab.id)
        )
    } catch (e) {
    }
}

async function handleMessengerRegistration() {
    const {backgroundHandlers} = useProvider()
    backgroundHandlers.listen()
}

export const startServiceWorker = async () => {
    await loadSettings()
    log.info('Initializing background')
    await handleVersionCheck()
    await handleContextMenuCreation()
    await handleMessengerRegistration()
}
