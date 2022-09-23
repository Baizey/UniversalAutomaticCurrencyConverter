import { ServiceCollection, stateful } from 'sharp-dependency-injection'
import { CurrencyAmount, CurrencyAmountDi } from './CurrencyAmount'
import { CurrencyElement, CurrencyElementDi } from './CurrencyElement'

export { CurrencyAmount, CurrencyAmountProps } from './CurrencyAmount'
export { CurrencyElement } from './CurrencyElement'

export type CurrencyDi = CurrencyAmountDi & CurrencyElementDi

export const addCurrencyDi = <T>( services: ServiceCollection<T> ) => services.add( {
	currencyElement: stateful( CurrencyElement ),
	currencyAmount: stateful( CurrencyAmount ),
} )