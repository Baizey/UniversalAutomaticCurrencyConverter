import { propertyOf, ServiceCollection, singleton, stateful } from 'sharp-dependency-injection'
import { ActiveLocalization, ActiveLocalizationDi } from './ActiveLocalization'
import { CurrencyLocalization, CurrencyLocalizationDi } from './CurrencyLocalization'

export { ActiveLocalization } from './ActiveLocalization'
export type { IActiveLocalization } from './ActiveLocalization'
export { Localizations } from './Localization'

export type LocalizationDi = ActiveLocalizationDi & CurrencyLocalizationDi

const {
	activeLocalization,
	currencyLocalization,
} = propertyOf<LocalizationDi>()

export const addLocalizationDi = <T>( services: ServiceCollection<T> ) => services.add( {
	[activeLocalization]: singleton( ActiveLocalization ),
	[currencyLocalization]: stateful( CurrencyLocalization ),
} )