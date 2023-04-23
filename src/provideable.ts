import {CurrencyConverterDi} from './currencyConverter'
import {InfrastructureDi} from './infrastructure'
import {AsServices} from "@baizey/dependency-injection/lib/utils";

export const _Providable = {...InfrastructureDi, ...CurrencyConverterDi}
export type Providable = AsServices<typeof _Providable>