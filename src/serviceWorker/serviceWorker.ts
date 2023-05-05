// This file is run as a background script
import {log, useProvider} from '../di'
import {ContextMenuItem} from "./contextMenuItem";

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

async function handleMessengerRegistration() {
    const {backgroundMessenger} = useProvider()
    backgroundMessenger.listen()
}

export const startServiceWorker = async () => {
    await loadSettings()
    log.info('Initializing background')
    await handleVersionCheck()
    await handleContextMenuCreation()
    await handleMessengerRegistration()
}
