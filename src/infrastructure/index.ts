import { AsServices } from 'sharp-dependency-injection/lib/utils'
import { Browser, BrowserDi } from './Browser'
import { MessengerDi } from './BrowserMessengers'
import { ConfigDi } from './Configuration'
import { Logger, LoggerDi } from './Logger/Logger'

export { Browser } from './Browser'
export { Configuration } from './Configuration'
export { Logger } from './Logger'

export * from './BrowserMessengers'

export type { ISetting } from './Configuration/setting/ISetting'
export { mapToTheme, themes } from './Theme'
export type { ThemeProps, MyTheme } from './Theme'

export const InfrastructureDi = {
	...BrowserDi,
	...LoggerDi,
	...ConfigDi,
	...MessengerDi,
}

export type InfrastructureDiTypes = AsServices<typeof InfrastructureDi>