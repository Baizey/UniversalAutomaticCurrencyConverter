import { useProvider } from "./di";
import { OptionsUi } from "./ui3/OptionsUi";
import { ThemeHandler } from "./ui3/ThemeHandler";

const provider = useProvider()
const { backendApi, config } = provider
const symbolsPromise = backendApi.symbols()
const configPromise = config.load()
    .finally( () => {
        ThemeHandler.updateTheme( config.meta.colorTheme.value )
    } )

type SectionFilter = {
    div: HTMLDivElement,
    keys: string[]
}

document.addEventListener( "DOMContentLoaded", () => {
    const realRoot = document.getElementById( "uacc-root" )!!
    const root = realRoot.appendChild( OptionsUi.createOptionsBackground() )

    ;(async () => {
        const [ symbols ] = await Promise.all( [ symbolsPromise, configPromise ] )
        const optionSections: SectionFilter[] = []
        root.appendChild( OptionsUi.createGap( 2 ) )
        root.appendChild( OptionsUi.createInitialOptionsSection( ( filter ) => {
            optionSections.forEach( e => {
                if ( filter === '' || e.keys.some( e => e.includes( filter ) ) )
                    e.div.classList.remove( 'uacc-hidden' )
                else
                    e.div.classList.add( 'uacc-hidden' )
            } )
        } ) )
        optionSections.push( {
            keys: [ 'user', 'email', 'login', 'logout', 'password', 'recovery', 'reset', 'register' ],
            div: root.appendChild( OptionsUi.createLoginSection() )
        } )
        optionSections.push( {
            keys: [ 'currency', 'convert to', 'auto convert page' ],
            div: root.appendChild( OptionsUi.createCurrencyOptionSection( symbols ) )
        } )
        optionSections.push( {
            keys: [ 'formatting', 'thousands', 'grouping', 'decimal point', 'rounding', 'significant digits', 'important digits', ],
            div: root.appendChild( OptionsUi.createNumberFormattingOptionSection() )
        } )
        optionSections.push( {
            keys: [ 'localization', 'krone', 'dollars', 'yen', 'alert', 'notification' ],
            div: root.appendChild( OptionsUi.createLocalizationOptionSection( symbols ) )
        } )
        optionSections.push( {
            keys: [ 'currency format', 'custom display', 'conversion rate' ],
            div: root.appendChild( OptionsUi.createCustomDisplayOptionSection() )
        } )
        optionSections.push( {
            keys: [ 'keyboard shortcuts', 'hover', 'mouse', 'utils', 'helpers', 'convert all' ],
            div: root.appendChild( OptionsUi.createShortcutsOptionSection() )
        } )
        optionSections.push( {
            keys: [ 'misc', 'theme', 'styling', 'logging', 'brackets' ],
            div: root.appendChild( OptionsUi.createMiscOptionSection() )
        } )
        optionSections.push( {
            keys: [ 'highlight', 'duration', ],
            div: root.appendChild( OptionsUi.createNumberConversionHighlightingOptionSection() )
        } )
        optionSections.push( {
            keys: [ 'disable', 'block', 'currency', 'skip' ],
            div: root.appendChild( OptionsUi.createDisabledCurrencyCurrency( symbols ) )
        } )
        optionSections.push( {
            keys: [ 'whitelist', 'blacklist', 'site allowance', ],
            div: root.appendChild( OptionsUi.createSiteAllowanceSection() )
        } )

        root.appendChild( OptionsUi.createGap( 3 ) )
    })()

} );