import { BackgroundMessenger } from "./BackgroundMessenger";
import { propertyOf, singleton } from "@baizey/dependency-injection";
import {
    AuthLoginQuery,
    AuthLogoutQuery,
    AuthPasswordRecoveryQuery,
    AuthPasswordResetQuery,
    AuthUserInfoQuery,
    AuthUserRegisterQuery,
    BackgroundMessageHandler
} from "./BackgroundMessageHandler";
import { DetectionQuery } from "./DetectionQuery";
import { SymbolQuery } from "./SymbolQuery";
import { RateQuery } from "./RateQuery";

export type BackgroundMessengerQueryDi = {
    backgroundDetectQuery: DetectionQuery
    backgroundGetSymbolQuery: SymbolQuery
    backgroundGetRateQuery: RateQuery

    authLoginQuery: AuthLoginQuery
    authLogoutQuery: AuthLogoutQuery

    authPasswordRecoveryQuery: AuthPasswordRecoveryQuery
    authPasswordResetQuery: AuthPasswordResetQuery

    authUserInfoQuery: AuthUserInfoQuery
    authUserRegisterQuery: AuthUserRegisterQuery
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
    backgroundGetRateQuery,
    authPasswordRecoveryQuery,
    authPasswordResetQuery,
    authUserInfoQuery,
    authUserRegisterQuery,
    authLogoutQuery,
    authLoginQuery
} = propertyOf<BackgroundMessengerDi>()

export const BackgroundMessengerDi = {
    [authPasswordRecoveryQuery]: singleton( AuthPasswordRecoveryQuery ),
    [authPasswordResetQuery]: singleton( AuthPasswordResetQuery ),
    [authUserInfoQuery]: singleton( AuthUserInfoQuery ),
    [authUserRegisterQuery]: singleton( AuthUserRegisterQuery ),
    [authLogoutQuery]: singleton( AuthLogoutQuery ),
    [authLoginQuery]: singleton( AuthLoginQuery ),

    [backgroundDetectQuery]: singleton( DetectionQuery ),
    [backgroundGetSymbolQuery]: singleton( SymbolQuery ),
    [backgroundGetRateQuery]: singleton( RateQuery ),
    [backgroundHandlers]: singleton( BackgroundMessageHandler ),
    [backgroundMessenger]: singleton( BackgroundMessenger ),
}

export type { BackgroundMessenger }
export type { RatePath, RateResponse } from './RateQuery'