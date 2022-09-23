import { MockStrategy, ProviderMock, ServiceCollection } from 'sharp-dependency-injection'
import { addCurrencyConverterDi, CurrencyConverterDi } from '../currencyConverter'
import { addInfrastructureDi, InfrastructureDi } from '../infrastructure'

export type Providable = InfrastructureDi & CurrencyConverterDi
export type Mockable = MockStrategy | ProviderMock<Providable>

let _services: ServiceCollection<Providable> | undefined
let _proxy: Providable | undefined

export const useServices = (): ServiceCollection<Providable> => _services
	? _services
	: _services = new ServiceCollection()
		.addMethod( addInfrastructureDi )
		.addMethod( addCurrencyConverterDi )

export const setMockProvider = ( mock?: Mockable, defaultStrategy?: MockStrategy ): Providable =>
	_proxy = useServices().buildMock( mock, defaultStrategy ).proxy

export const useProvider = (): Providable => _proxy
	? _proxy
	: _proxy = useServices().build().proxy