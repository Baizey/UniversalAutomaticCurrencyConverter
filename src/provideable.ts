import {CurrencyConverterDi} from './currencyConverter'
import {InfrastructureDi} from './infrastructure'
import {DependenciesOf} from "@baizey/dependency-injection/lib/utils";

export const providable = {...InfrastructureDi, ...CurrencyConverterDi}
export type Providable = DependenciesOf<typeof providable>