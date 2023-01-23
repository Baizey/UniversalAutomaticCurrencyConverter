import { propertyOf, singleton } from 'sharp-dependency-injection'
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

export type InfrastructureDi = BrowserDi & ConfigDi & LoggerDi & MessengerDi

const {
	browser,
	logger,
} = propertyOf<InfrastructureDi>()

export const InfrastructureDi = {
	[browser]: singleton( Browser ),
	[logger]: singleton( Logger ),
	...ConfigDi,
	...MessengerDi,
}