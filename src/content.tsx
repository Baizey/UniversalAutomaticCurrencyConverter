// This file is injected as a content script
import { render } from 'preact/compat'
import { oneSecond, TimeSpan } from 'sharp-time-span'
import { CurrencyElement } from './currencyConverter/Currency'
import { useProvider } from './di'
import { ContentApp } from './ui2/content/app'

const isBlacklistedErrorMessage = `Site is blacklisted`

async function loadConfiguration(): Promise<void> {
	const { config } = useProvider()
	await config.load()
}

async function loadActiveLocalization(): Promise<void> {
	const {
		activeLocalization,
		logger,
	} = useProvider()
	await activeLocalization.load()
	logger.info( `Localization completed` )
}

function loadTabInformation(): boolean {
	const {
		browser,
		siteAllowance,
		tabState,
		logger,
		metaConfig: { useAutoConvertOnPageLoad },
	} = useProvider()
	logger.info( `Loaded settings` )

	// Check if blacklisted, if so abandon tab and dont do anything
	const allowance = siteAllowance.getAllowance( browser.url.href )
	tabState.setIsAllowed( allowance.isAllowed )
	tabState.setIsShowingConversions( useAutoConvertOnPageLoad.value )

	logger.debug(
		`Allowed: ${ allowance.isAllowed }, Last reason: ${
			allowance.reasoning.pop()?.url
		}`,
	)

	if ( !tabState.isAllowed ) {
		logger.warn( `${ browser.url.href } is blacklisted` )
		throw new Error( isBlacklistedErrorMessage )
	}

	logger.info( `Verified whitelisted website` )
	return tabState.isAllowed
}

function injectAlertSystem(): void {
	const div = document.createElement( 'div' )
	div.id = 'uacc-root'
	document.body.appendChild( div )
	render( <ContentApp/>, document.getElementById( 'uacc-root' )!! )
	useProvider().logger.info( `Injected alert system onto page` )
}

function injectShortcuts(): void {
	const {
		logger,
		tabState,
		qualityOfLifeConfig: {
			keyPressOnAllFlipConversion,
			keyPressOnHoverFlipConversion,
		},
	} =
		useProvider()

	// Add shortcut for convert all
	if ( keyPressOnAllFlipConversion.value ) {
		window.addEventListener( 'keyup', ( e ) => {
			if ( e.key !== keyPressOnAllFlipConversion.value ) return
			logger.debug( `Convert all shortcut activated` )
			tabState.flipAllConversions()
		} )
	}

	// Add shortcut for convert hover
	if ( keyPressOnHoverFlipConversion.value ) {
		window.addEventListener( 'keyup', ( e ) => {
			if ( e.key !== keyPressOnHoverFlipConversion.value ) return
			logger.debug( `Convert hovered shortcut activated` )
			tabState.flipHovered()
		} )
	}
}

async function injectConversions(): Promise<void> {
	const {
		logger,
		tabState,
	} = useProvider()

	new MutationObserver( async ( mutations ) => {
		try {
			logger.debug( `Dynamic content added, looking for currencies` )
			let discovered = 0
			for ( const mutation of mutations ) {
				const addedNodes = mutation.addedNodes
				for ( let i = 0; i < addedNodes.length; i++ ) {
					const node = addedNodes[i]
					const element = node.parentElement
					if ( !element || childOfUACCWatched( element ) ) continue
					discovered += ( await detectAllElements( element ) ).length
				}
			}
			logger.debug( `Newly loaded content, found ${ discovered } currencies` )
		} catch ( err: unknown ) {
			logger.error( err as Error )
		}
	} ).observe( document.body, {
		childList: true,
		subtree: true,
		attributes: true,
		characterData: true,
	} )

	// Detect all currencies on page
	logger.info( `Starting full-page checking` )
	await detectAllNewElementsRecurring()
	logger.info( `Done full-page check, found ${ tabState.conversions.length } currencies` )
}

function handleError( error: Error ): void {
	const { logger } = useProvider()
	switch ( error?.message || error ) {
		case isBlacklistedErrorMessage:
			break
		default:
			logger.error( error )
			break
	}
}

( async () => {
	useProvider().logger.info( 'UACC started' )
	await loadConfiguration()
	await loadActiveLocalization()

	loadTabInformation()

	injectAlertSystem()

	injectShortcuts()

	await injectConversions()
} )().catch( handleError )

async function detectAllElements(
	parent: HTMLElement,
): Promise<CurrencyElement[]> {
	const {
		currencyTagConfig: { convertTo },
		elementDetector,
		tabState,
	} = useProvider()
	const currency = convertTo.value

	const discovered: CurrencyElement[] = elementDetector.find( parent )

	for ( let element of discovered ) {
		await element.convertTo( currency )
		element.setupListener()
		await element.show()
		if ( tabState.isShowingConversions && !tabState.isPaused ) {
			element.highlight()
		}
	}

	discovered.forEach( ( e ) => tabState.conversions.push( e ) )
	return discovered
}

async function detectAllNewElementsRecurring(): Promise<void> {
	const { logger } = useProvider()
	const attempts = 3
	for ( let i = 1, delay = oneSecond; i <= attempts; i++, delay = delay.multiplyBy( 2 ) ) {
		logger.info( `Auto check ${ i }/${ attempts } starting` )
		const result = await detectAllElements( document.body )
		logger.info( `Auto check ${ i }/${ attempts }, found ${ result.length } currencies` )
		await wait( delay )
	}
}

function wait( span: TimeSpan ): Promise<void> {
	return new Promise( ( resolve ) => setTimeout( () => resolve(), span.millis ) )
}

function childOfUACCWatched( element: HTMLElement ): boolean {
	if ( !element || element.hasAttribute( 'uacc:watched' ) ) return true
	if ( !element.parentElement ) return false
	return childOfUACCWatched( element.parentElement )
}
