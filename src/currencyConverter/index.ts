import { BackendApiDi } from './BackendApi'
import { CurrencyDi } from './Currency'
import { DetectionDi } from './Detection'
import { TabStateDi } from './Live/TabState'
import { LocalizationDi } from './Localization'

export const CurrencyConverterDi = {
	...TabStateDi,
	...BackendApiDi,
	...LocalizationDi,
	...DetectionDi,
	...CurrencyDi,
}