import {Browser, BrowserDiTypes} from '../../index'
import {log} from "../../../di";
import {MessageResponse, MessengerHandlerManager} from "../messengerHandlerManager";
import {BackgroundMessengerDi} from "./index";

export enum BackgroundMessageType {
    getRate = 'getRate',
    getSymbols = 'getSymbols',
}

export type RateBackgroundMessage = {
    type: BackgroundMessageType.getRate
    from: string
    to: string
}

export type SymbolBackgroundMessage = {
    type: BackgroundMessageType.getSymbols
}

export type BackgroundMessage =
    | RateBackgroundMessage
    | SymbolBackgroundMessage

export type RatePath = {
    from: string;
    to: string;
    source: string;
    rate: number;
    timestamp: number;
}[];

export type RateResponse = {
    from: string;
    to: string;
    rate: number;
    timestamp: number;
    path: RatePath;
};

export class BackgroundMessenger {
    private readonly browser: Browser
    private readonly handlers: MessengerHandlerManager

    constructor({browser, backgroundHandlers}: BrowserDiTypes & BackgroundMessengerDi) {
        this.browser = browser
        this.handlers = backgroundHandlers
    }

    listen() {
        const handlers = this.handlers
        this.browser.runtime.onMessage.addListener((request: BackgroundMessage, sender, senderResponse,): boolean => {
            handlers.handle(senderResponse, request.type, request).catch(log.error)
            return true
        })
    }

    async getRate(from: string, to: string): Promise<RateResponse> {
        return await this.sendMessage({type: BackgroundMessageType.getRate, to, from})
    }

    async getSymbols(): Promise<Record<string, string>> {
        return await this.sendMessage({type: BackgroundMessageType.getSymbols})
    }

    private async sendMessage<Response>(data: BackgroundMessage): Promise<Response> {
        const response = await this.browser.runtime.sendMessage(data) as MessageResponse<Response>
        if (!response.success) throw response.data
        return response.data
    }
}