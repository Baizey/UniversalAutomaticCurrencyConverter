import { singleton } from '@baizey/dependency-injection'
import { Configuration, SubConfigDi } from './Configuration'
import {DependenciesOf} from "@baizey/dependency-injection/lib/utils";

export { Configuration } from './Configuration'

export const ConfigDi = {
	...SubConfigDi,
	config: singleton( Configuration ),
}

export type ConfigDiTypes = DependenciesOf<typeof ConfigDi>
