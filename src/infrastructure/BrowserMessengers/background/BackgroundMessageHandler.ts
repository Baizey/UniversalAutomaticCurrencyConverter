import { MessengerHandlerManager, Query } from "../messengerHandlerManager";
import { BackgroundMessengerQueryDi, BrowserDiTypes } from "../../index";
import { BackgroundMessageType } from "./BackgroundMessageType";
import { BackendApiCaller } from "../../../serviceWorker/BackendApiCaller";

export class BackgroundMessageHandler extends MessengerHandlerManager {
    constructor( p: BrowserDiTypes & BackgroundMessengerQueryDi ) {
        super( p )
        this.add( p.backgroundGetRateQuery )
        this.add( p.backgroundGetSymbolQuery )
        this.add( p.backgroundDetectQuery )

        this.add( p.authLogoutQuery )
        this.add( p.authLoginQuery )

        this.add( p.authUserRegisterQuery )
        this.add( p.authUserInfoQuery )

        this.add( p.authPasswordResetQuery )
        this.add( p.authPasswordRecoveryQuery )
    }
}

export enum UserType {
    guest = 'guest',
    registered = 'registered',
    plus = 'plus',
    ultimate = 'ultimate',
}

export type UserInfoResponse = {
    email: string,
    type: UserType,
}

export type SessionInfoResponse = {
    sessionId: string,
    timestamp: number
}

export type UserWithSessionInfoResponse = {
    user: UserInfoResponse,
    session: SessionInfoResponse,
}

export type UserRegisterRequest = {
    type: BackgroundMessageType.users_register
    email: string,
}
export type UserInfoRequest = {
    type: BackgroundMessageType.users_info
}

export type UserLoginRequest = {
    type: BackgroundMessageType.login
    email: string,
    password: string,
}
export type UserLogoutRequest = {
    type: BackgroundMessageType.logout
}


export type UserRecoveryRequest = {
    type: BackgroundMessageType.password_recovery
    email: string,
}

export type UserResetPasswordRequest = {
    type: BackgroundMessageType.password_reset
    newPassword: string,
    token: string,
}


export class AuthLoginQuery implements Query<UserLoginRequest, SessionInfoResponse> {
    readonly key = BackgroundMessageType.login

    async handle( request: UserLoginRequest ): Promise<SessionInfoResponse> {
        return BackendApiCaller.fetchJson<SessionInfoResponse>( `api/v1/auth/login`, {
            method: 'POST',
            body: request,
        } )
    }
}

export class AuthLogoutQuery implements Query<UserLogoutRequest, boolean> {
    readonly key = BackgroundMessageType.logout

    async handle( request: UserLogoutRequest ): Promise<boolean> {
        await BackendApiCaller.fetchOk( `api/v1/auth/logout`, {
            method: 'DELETE',
        } )
        return true
    }
}

export class AuthPasswordRecoveryQuery implements Query<UserRecoveryRequest, boolean> {
    readonly key = BackgroundMessageType.password_recovery

    async handle( request: UserRecoveryRequest ): Promise<boolean> {
        await BackendApiCaller.fetchOk( `api/v1/auth/password/recovery`, {
            method: 'POST',
            body: request,
        } )
        return true
    }
}

export class AuthPasswordResetQuery implements Query<UserResetPasswordRequest, UserWithSessionInfoResponse> {
    readonly key = BackgroundMessageType.password_reset

    async handle( request: UserResetPasswordRequest ): Promise<UserWithSessionInfoResponse> {
        return BackendApiCaller.fetchJson<UserWithSessionInfoResponse>( `api/v1/auth/password/reset`, {
            method: 'POST',
            body: request,
        } )
    }
}

export class AuthUserInfoQuery implements Query<UserInfoRequest, UserInfoResponse> {
    readonly key = BackgroundMessageType.users_info

    async handle( request: UserInfoRequest ): Promise<UserInfoResponse> {
        return BackendApiCaller.fetchJson<UserInfoResponse>( `api/v1/auth/users` )
    }
}

export class AuthUserRegisterQuery implements Query<UserRegisterRequest, SessionInfoResponse> {
    readonly key = BackgroundMessageType.users_register

    async handle( request: UserRegisterRequest ): Promise<SessionInfoResponse> {
        return BackendApiCaller.fetchJson<SessionInfoResponse>( `api/v1/auth/users/register`, {
            method: 'POST',
            body: request,
        } )
    }
}