import { ServiceCollection, singleton } from 'sharp-dependency-injection'
import { Browser, BrowserDi } from './Browser'
import { addMessengerDi, MessengerDi } from './BrowserMessengers'
import { addConfigDi, ConfigDi } from './Configuration'
import { Logger, LoggerDi } from './Logger/Logger'

export { Browser } from './Browser'
export { Configuration } from './Configuration'
export { ILogger, Logger } from './Logger'

export {
	BackgroundMessageType,
	PopupMessageType,
	TabMessageType,
} from './BrowserMessengers'
export type {
	BackgroundMessage,
	PopupMessage,
	TabMessage,
} from './BrowserMessengers'
export { ISetting } from './Configuration/setting/ISetting'
export { ThemeProps, MyTheme, mapToTheme, themes } from './Theme'

export type InfrastructureDi = BrowserDi & ConfigDi & LoggerDi & MessengerDi

export function addInfrastructureDi( services: ServiceCollection ) {
	return services
		.add( {
			browser: singleton( Browser ),
			logger: singleton( Logger ),
		} )
		.addMethod( addConfigDi )
		.addMethod( addMessengerDi )
}