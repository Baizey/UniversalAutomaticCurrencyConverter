import { singleton } from 'sharp-dependency-injection'
import { AsServices } from 'sharp-dependency-injection/lib/utils'
import { Configuration, SubConfigDi } from './Configuration'

export { Configuration } from './Configuration'

export const ConfigDi = {
	...SubConfigDi,
	config: singleton( Configuration ),
}

export type ConfigDiTypes = AsServices<typeof ConfigDi>