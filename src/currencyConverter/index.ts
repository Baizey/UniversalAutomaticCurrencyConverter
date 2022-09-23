import { ServiceCollection, singleton } from 'sharp-dependency-injection'
import { InfrastructureDi } from '../infrastructure'
import { BackendApi, BackendApiDi } from './BackendApi'
import { addCurrencyDi, CurrencyDi } from './Currency'
import { addDetectionDi, DetectionDi } from './Detection'
import { TabState, TabStateDi } from './Live/TabState'
import { addLocalizationDi, LocalizationDi } from './Localization'

export type CurrencyConverterDi = BackendApiDi & LocalizationDi & DetectionDi & CurrencyDi & TabStateDi

export function addCurrencyConverterDi( services: ServiceCollection<InfrastructureDi> ) {
	return services
		.add( {
			tabState: singleton( TabState ),
			backendApi: singleton( BackendApi ),
		} )
		.addMethod( addLocalizationDi )
		.addMethod( addDetectionDi )
		.addMethod( addCurrencyDi )
}