import {BackgroundMessenger} from "./BackgroundMessenger";
import {propertyOf, singleton} from "@baizey/dependency-injection";
import {BackgroundMessageHandler} from "./BackgroundMessageHandler";
import {DetectionQuery} from "./DetectionQuery";
import {SymbolQuery} from "./SymbolQuery";
import {RateQuery} from "./RateQuery";

export type BackgroundMessengerQueryDi = {
    backgroundDetectQuery: DetectionQuery
    backgroundGetSymbolQuery: SymbolQuery
    backgroundGetRateQuery: RateQuery
}

export type BackgroundMessengerDi = BackgroundMessengerQueryDi & {
    backgroundHandlers: BackgroundMessageHandler
    backgroundMessenger: BackgroundMessenger
}

const {
    backgroundMessenger,
    backgroundHandlers,
    backgroundDetectQuery,
    backgroundGetSymbolQuery,
    backgroundGetRateQuery
} = propertyOf<BackgroundMessengerDi>()

export const BackgroundMessengerDi = {
    [backgroundDetectQuery]: singleton(DetectionQuery),
    [backgroundGetSymbolQuery]: singleton(SymbolQuery),
    [backgroundGetRateQuery]: singleton(RateQuery),
    [backgroundHandlers]: singleton(BackgroundMessageHandler),
    [backgroundMessenger]: singleton(BackgroundMessenger),
}

export type {BackgroundMessenger}
export type {RatePath, RateResponse} from './RateQuery'