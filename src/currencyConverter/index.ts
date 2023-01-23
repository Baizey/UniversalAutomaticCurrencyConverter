import { propertyOf, singleton } from 'sharp-dependency-injection'
import { BackendApi, BackendApiDi } from './BackendApi'
import { CurrencyDi } from './Currency'
import { DetectionDi } from './Detection'
import { TabState, TabStateDi } from './Live/TabState'
import { LocalizationDi } from './Localization'

export type CurrencyConverterDi = BackendApiDi & LocalizationDi & DetectionDi & CurrencyDi & TabStateDi

const {
	tabState,
	backendApi,
} = propertyOf<CurrencyConverterDi>()

export const CurrencyConverterDi = {
	[tabState]: singleton( TabState ),
	[backendApi]: singleton( BackendApi ),
	...LocalizationDi,
	...DetectionDi,
	...CurrencyDi,
}