import { useProvider } from "./di";
import { PopupUi } from "./ui3/PopupUi";
import { ThemeHandler } from "./ui3/ThemeHandler";

const { backendApi, config } = useProvider()
const symbolsPromise = backendApi.symbols()
const configPromise = config.load()
    .finally( () => {
        ThemeHandler.updateTheme( config.meta.colorTheme.value )
    } )

document.addEventListener( "DOMContentLoaded", () => {
    const root = document.getElementById( "uacc-root" )!!

    ;(async () => {
        const [ symbols ] = await Promise.all( [ symbolsPromise, configPromise ] )
        root.appendChild( PopupUi.createPopup( symbols ) )
    })()
} )
