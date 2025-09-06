import {useProvider} from "./di";
import {OptionsUi} from "./ui3/OptionsUi";
import {ThemeHandler} from "./ui3/ThemeHandler";

const provider = useProvider()
const {backendApi, config} = provider
const root = document.body.appendChild(OptionsUi.createOptionsBackground())
const symbolsPromise = backendApi.symbols()
const configPromise = config.load()
    .finally(() => {
        ThemeHandler.updateTheme(config.meta.colorTheme.value)
    })

let filter: string = ""
document.addEventListener("DOMContentLoaded", () => {
    ;(async () => {
        const [symbols] = await Promise.all([symbolsPromise, configPromise])
        root.appendChild(OptionsUi.createFilterOptionsSection((filter) => {
            // TODO: handle filter
        }))
        root.appendChild(OptionsUi.createCurrencyOptionSection(symbols))
        root.appendChild(OptionsUi.createLocalizationOptionSection(symbols))
        root.appendChild(OptionsUi.createShortcutsOptionSection())
    })()

});