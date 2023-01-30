import { AsServices } from 'sharp-dependency-injection/lib/utils'
import { CurrencyAmount, CurrencyAmountDi } from './CurrencyAmount'
import { CurrencyElement, CurrencyElementDi } from './CurrencyElement'

export type { CurrencyAmountProps } from './CurrencyAmount'
export { CurrencyAmount } from './CurrencyAmount'
export { CurrencyElement } from './CurrencyElement'

export const CurrencyDi = { ...CurrencyAmountDi, ...CurrencyElementDi }
export type CurrencyDiTypes = AsServices<typeof CurrencyDi>