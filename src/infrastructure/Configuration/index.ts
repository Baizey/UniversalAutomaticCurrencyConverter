import { singleton } from '@baizey/dependency-injection'
import { Configuration, SubConfigDi } from './Configuration'
import {AsServices} from "@baizey/dependency-injection/lib/utils";

export { Configuration } from './Configuration'

export const ConfigDi = {
	...SubConfigDi,
	config: singleton( Configuration ),
}

export type ConfigDiTypes = AsServices<typeof ConfigDi>
