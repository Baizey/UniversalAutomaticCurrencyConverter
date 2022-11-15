import { propertyOf, ServiceCollection, singleton } from 'sharp-dependency-injection'
import { Browser, BrowserDi } from './Browser'
import { addMessengerDi, MessengerDi } from './BrowserMessengers'
import { addConfigDi, ConfigDi } from './Configuration'
import { Logger, LoggerDi } from './Logger/Logger'

export { Browser } from './Browser'
export { Configuration } from './Configuration'
export { Logger } from './Logger'

export {
	BackgroundMessageType,
	PopupMessageType,
	TabMessageType,
	BackgroundMessenger,
	PopupMessenger,
	TabMessenger,
} from './BrowserMessengers'

export type { ISetting } from './Configuration/setting/ISetting'
export { mapToTheme, themes } from './Theme'
export type { ThemeProps, MyTheme } from './Theme'

export type InfrastructureDi = BrowserDi & ConfigDi & LoggerDi & MessengerDi

const {
	browser,
	logger,
} = propertyOf<InfrastructureDi>()

export function addInfrastructureDi( services: ServiceCollection ) {
	return services
		.add( {
			[browser]: singleton( Browser ),
			[logger]: singleton( Logger ),
		} )
		.addMethod( addConfigDi )
		.addMethod( addMessengerDi )
}