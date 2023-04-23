import { propertyOf, singleton } from '@baizey/dependency-injection'
import { BackgroundMessenger } from './BackgroundMessenger'
import { PopupMessenger } from './PopupMessenger'
import { TabMessenger } from './TabMessenger'

export * from './BackgroundMessenger'
export * from './PopupMessenger'
export * from './TabMessenger'

export type MessengerDi = {
	popupMessenger: PopupMessenger
	backgroundMessenger: BackgroundMessenger
	tabMessenger: TabMessenger
}

const { popupMessenger, backgroundMessenger, tabMessenger } = propertyOf<MessengerDi>()

export const MessengerDi = {
	[popupMessenger]: singleton( PopupMessenger ),
	[backgroundMessenger]: singleton( BackgroundMessenger ),
	[tabMessenger]: singleton( TabMessenger ),
}