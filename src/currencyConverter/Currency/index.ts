import { CurrencyAmount, CurrencyAmountDi } from './CurrencyAmount'
import { CurrencyElement, CurrencyElementDi } from './CurrencyElement'
import {DependenciesOf} from "@baizey/dependency-injection/lib/utils";

export type { CurrencyAmountProps } from './CurrencyAmount'
export { CurrencyAmount } from './CurrencyAmount'
export { CurrencyElement } from './CurrencyElement'

export const CurrencyDi = { ...CurrencyAmountDi, ...CurrencyElementDi }
export type CurrencyDiTypes = DependenciesOf<typeof CurrencyDi>