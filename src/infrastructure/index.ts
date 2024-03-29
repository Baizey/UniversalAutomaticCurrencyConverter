import { Browser } from './Browser'
import { MessengerDi } from './BrowserMessengers'
import { ConfigDi } from './Configuration'
import { Logger, LoggerDi } from './Logger/Logger'
import {singleton} from "@baizey/dependency-injection";
import {DependenciesOf} from "@baizey/dependency-injection/lib/utils";

export { Browser } from './Browser'
export { Configuration } from './Configuration'
export { Logger } from './Logger'

export * from './BrowserMessengers'

export type { ISetting } from './Configuration/setting/ISetting'
export { mapToTheme, themes } from './Theme'
export type { MyTheme } from './Theme'

const BrowserDi = { browser: singleton( Browser ) }
export type BrowserDiTypes = DependenciesOf<typeof BrowserDi>

export const InfrastructureDi = {
	...BrowserDi,
	...LoggerDi,
	...ConfigDi,
	...MessengerDi,
}

export type InfrastructureDiTypes = DependenciesOf<typeof InfrastructureDi>