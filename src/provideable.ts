import { AsServices } from 'sharp-dependency-injection/lib/utils'
import { CurrencyConverterDi } from './currencyConverter'
import { InfrastructureDi } from './infrastructure'

export const _Providable = { ...InfrastructureDi, ...CurrencyConverterDi }
export type Providable = AsServices<typeof _Providable>