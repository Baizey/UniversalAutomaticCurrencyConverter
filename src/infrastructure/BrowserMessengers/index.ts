import {propertyOf, singleton} from '@baizey/dependency-injection'
import {PopupMessenger} from './PopupMessenger'
import {TabMessenger} from './TabMessenger'
import {BackgroundMessengerDi} from "./background";

export * from './background/BackgroundMessenger'
export * from './PopupMessenger'
export * from './TabMessenger'

export type MessengerDi = {
    popupMessenger: PopupMessenger
    tabMessenger: TabMessenger
} & BackgroundMessengerDi

const {popupMessenger, tabMessenger} = propertyOf<MessengerDi>()

export const MessengerDi = {
    ...BackgroundMessengerDi,
    [popupMessenger]: singleton(PopupMessenger),
    [tabMessenger]: singleton(TabMessenger),
}

export * from './background'