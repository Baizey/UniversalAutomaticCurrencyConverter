import {BackgroundMessenger} from "./BackgroundMessenger";
import {propertyOf, singleton} from "@baizey/dependency-injection";
import {MessengerHandlerManager} from "../messengerHandlerManager";
import {RateQuery} from "./RateQuery";
import {SymbolQuery} from "./SymbolQuery";

export type BackgroundMessengerDi = {
    backgroundHandlers: MessengerHandlerManager
    backgroundMessenger: BackgroundMessenger
}

const {backgroundMessenger, backgroundHandlers} = propertyOf<BackgroundMessengerDi>()

export const BackgroundMessengerDi = {
    [backgroundHandlers]: singleton({
        factory: () => {
            const handler = new MessengerHandlerManager()
            handler.add(new RateQuery())
            handler.add(new SymbolQuery())
            return handler
        }
    }),
    [backgroundMessenger]: singleton(BackgroundMessenger),
}