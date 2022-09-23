import { ServiceCollection, singleton } from 'sharp-dependency-injection'
import { BackgroundMessenger } from './BackgroundMessenger'
import { PopupMessenger } from './PopupMessenger'
import { TabMessenger } from './TabMessenger'

export {
	BackgroundMessageType,
	BackgroundMessage,
} from './BackgroundMessenger'
export { PopupMessageType, PopupMessage } from './PopupMessenger'
export { TabMessageType, TabMessage } from './TabMessenger'

export type MessengerDi = {
	popupMessenger: PopupMessenger
	backgroundMessenger: BackgroundMessenger
	tabMessenger: TabMessenger
}

export const addMessengerDi = <T>( services: ServiceCollection<T> ) => services.add( {
	popupMessenger: singleton( PopupMessenger ),
	backgroundMessenger: singleton( BackgroundMessenger ),
	tabMessenger: singleton( TabMessenger ),
} )