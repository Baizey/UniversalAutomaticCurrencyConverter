// This file is run as a background script
import { log, useProvider } from '../di'
import { ContextMenuItem } from "./contextMenuItem";
import { generateUUID } from "./utils";
import { SemVerPart, SemVersion } from "../infrastructure/Version";

async function loadSettings() {
    const { browser } = useProvider()
    browser.setAsServiceWorker()
    const { config } = useProvider()
    await config.load()

    // Ensure we have a trace id and lock it in when we make it
    if ( config.user.traceId.value === '' ) {
        await config.user.traceId.setAndSaveValue( generateUUID() )
    }

    const { activeLocalization } = useProvider()
    await activeLocalization.load( '<html lang="us-EN"></html>' )
}

async function handleVersionCheck() {
    const {
        browser,
        metaConfig: { lastVersion },
    } = useProvider()
    // Force open options if updating to a new major version
    const current = SemVersion.parse( browser.extensionVersion )
    const last = SemVersion.parse( lastVersion.value )
    const diff = last.difference( current )
    if ( diff === SemVerPart.major ) await browser.tabs.create( { url: 'options.html' } )
}


async function handleContextMenuCreation() {
    const { browser, tabMessenger } = useProvider()
    browser.contextMenus.removeAll( () => {
        browser.contextMenus.create( {
                id: ContextMenuItem.openContextMenu,
                title: `Open context menu...`,
                contexts: [ 'all', ]
            },
            () => browser.contextMenus.onClicked.addListener( ( _, tab ) => tabMessenger.openContextMenu( tab!.id ) ) )
    } )
}

async function handleMessengerRegistration() {
    const { backgroundHandlers } = useProvider()
    backgroundHandlers.listen()
}

let hasRun = false
export const startServiceWorker = async () => {
    if ( hasRun ) return
    await loadSettings()
    log.info( 'loadSettings' )
    await handleVersionCheck()
    log.info( 'handleVersionCheck' )
    await handleContextMenuCreation()
    log.info( 'handleContextMenuCreation' )
    await handleMessengerRegistration()
    log.info( 'handleMessengerRegistration' )
    hasRun = true
}
