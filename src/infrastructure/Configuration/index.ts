import { propertyOf, ServiceCollection, singleton } from 'sharp-dependency-injection'
import {
	Configuration,
	ConversionHighlightConfig,
	CurrencyStylingConfig,
	CurrencyTagConfig,
	LocalizationConfig,
	MetaConfig,
	NumberStylingConfig,
	QualityOfLifeConfig,
	SiteAllowanceConfig,
	SubConfigDi,
} from './Configuration'

export { Configuration } from './Configuration'

export type ConfigDi = SubConfigDi & {
	config: Configuration
}

const {
	numberStylingConfig,
	currencyStylingConfig,
	qualityOfLifeConfig,
	siteAllowanceConfig,
	localizationConfig,
	highlightConfig,
	currencyTagConfig,
	metaConfig,
	config,
} = propertyOf<ConfigDi>()

export const addConfigDi = <T>( services: ServiceCollection<T> ) => services.add( {
	[numberStylingConfig]: singleton( NumberStylingConfig ),
	[currencyStylingConfig]: singleton( CurrencyStylingConfig ),
	[qualityOfLifeConfig]: singleton( QualityOfLifeConfig ),
	[siteAllowanceConfig]: singleton( SiteAllowanceConfig ),
	[localizationConfig]: singleton( LocalizationConfig ),
	[highlightConfig]: singleton( ConversionHighlightConfig ),
	[currencyTagConfig]: singleton( CurrencyTagConfig ),
	[metaConfig]: singleton( MetaConfig ),
	[config]: singleton( Configuration ),
} )