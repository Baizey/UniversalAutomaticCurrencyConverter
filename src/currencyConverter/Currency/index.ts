import { propertyOf, stateful } from 'sharp-dependency-injection'
import type { CurrencyAmountDi } from './CurrencyAmount'
import { CurrencyAmount } from './CurrencyAmount'
import type { CurrencyElementDi } from './CurrencyElement'
import { CurrencyElement } from './CurrencyElement'

export type { CurrencyAmountProps } from './CurrencyAmount'
export { CurrencyAmount } from './CurrencyAmount'
export { CurrencyElement } from './CurrencyElement'

export type CurrencyDi = CurrencyAmountDi & CurrencyElementDi

const {
	currencyElement,
	currencyAmount,
} = propertyOf<CurrencyDi>()

export const CurrencyDi = {
	[currencyElement]: stateful( CurrencyElement ),
	[currencyAmount]: stateful( CurrencyAmount ),
}