import { Browser, BrowserDiTypes } from '../../index'
import { MessageResponse } from "../messengerHandlerManager";
import { RateBackgroundMessage, RatesResponse } from "./RateQuery";
import { SymbolBackgroundMessage, SymbolResponse } from "./SymbolQuery";
import { BackgroundMessageType } from "./BackgroundMessageType";
import { DetectionBackgroundMessage } from "./DetectionQuery";
import { PseudoDom } from "../../../currencyConverter/Detection/pseudoDom";
import { useProvider } from "../../../di";
import {
    UserInfoRequest,
    UserInfoResponse,
    UserLoginRequest,
    UserWithSessionInfoResponse,
    UserLogoutRequest,
    UserRecoveryRequest,
    UserRegisterRequest,
    UserResetPasswordRequest
} from "./BackgroundMessageHandler";

export type BackgroundMessage =
    | RateBackgroundMessage
    | SymbolBackgroundMessage
    | DetectionBackgroundMessage
    | UserRecoveryRequest
    | UserResetPasswordRequest
    | UserLogoutRequest
    | UserLoginRequest
    | UserInfoRequest
    | UserRegisterRequest

export class BackgroundMessenger {
    private readonly browser: Browser

    constructor( { browser }: BrowserDiTypes ) {
        this.browser = browser
    }

    async findCurrencyHolders( dom: PseudoDom ): Promise<HTMLElement[]> {
        const request: BackgroundMessage = { type: BackgroundMessageType.detect, root: dom.root }
        const result = await this.sendMessage<number[]>( request )
        return result.map( id => dom.element( id ) ).filter( e => e ) as HTMLElement[]
    }

    async getRates( to: string ): Promise<RatesResponse> {
        const request: BackgroundMessage = { type: BackgroundMessageType.getRate, to }
        return await this.sendMessage( request )
    }

    async getSymbols(): Promise<SymbolResponse> {
        const request: BackgroundMessage = { type: BackgroundMessageType.getSymbols }
        return await this.sendMessage( request )
    }

    async recoverPassword( email: string ): Promise<boolean> {
        const request: BackgroundMessage = { type: BackgroundMessageType.password_recovery, email }
        return await this.sendMessage( request )
    }

    async resetPassword( token: string, newPassword: string ): Promise<UserWithSessionInfoResponse> {
        const request: BackgroundMessage = { type: BackgroundMessageType.password_reset, token, newPassword }
        return await this.sendMessage( request )
    }

    async userInfo(): Promise<UserInfoResponse> {
        const request: BackgroundMessage = { type: BackgroundMessageType.users_info }
        return await this.sendMessage( request )
    }

    async register( email: string ): Promise<UserWithSessionInfoResponse> {
        const request: BackgroundMessage = { type: BackgroundMessageType.users_register, email }
        return await this.sendMessage( request )
    }

    async login( email: string, password: string ): Promise<UserWithSessionInfoResponse> {
        const request: BackgroundMessage = { type: BackgroundMessageType.login, email, password }
        return await this.sendMessage( request )
    }

    async logout(): Promise<boolean> {
        const request: BackgroundMessage = { type: BackgroundMessageType.logout }
        return await this.sendMessage( request )
    }

    private async sendMessage<Response>( data: BackgroundMessage ): Promise<Response> {
        const response = this.browser.isServiceWorker
            ? await this.handleLocally<Response>( data )
            : await this.browser.runtime.sendMessage( data ) as MessageResponse<Response>
        if ( !response.success ) throw response.data
        return response.data
    }

    private handleLocally<Response>( request: BackgroundMessage ): Promise<MessageResponse<Response>> {
        const { backgroundHandlers } = useProvider()
        return new Promise( (( resolve ) => backgroundHandlers.handle( resp => resolve( resp ), request.type, request )) )
    }
}