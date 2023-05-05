import {Browser, BrowserDiTypes} from '../index'
import {isCurrencyTag} from "../../serviceWorker/utils";
import {RateApi} from "../../serviceWorker/RateApi";
import {log} from "../../di";
import {MessageResponse, MessengerHandlerManager, Query} from "./messengerHandlerManager";

export enum BackgroundMessageType {
    getRate = 'getRate',
    getSymbols = 'getSymbols',
}

type RateBackgroundMessage = {
    type: BackgroundMessageType.getRate
    from: string
    to: string
}

type SymbolBackgroundMessage = {
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

    constructor({browser}: BrowserDiTypes) {
        this.browser = browser
        this.handlers = new MessengerHandlerManager()
        this.handlers.add(new RateQuery())
        this.handlers.add(new SymbolQuery())
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


class RateQuery implements Query<RateBackgroundMessage, RateResponse> {
    readonly key = BackgroundMessageType.getRate

    async handle(request: RateBackgroundMessage): Promise<RateResponse> {
        if (!isCurrencyTag(request.to) || !isCurrencyTag(request.from))
            throw new Error(`Invalid currency tags given (${request.from}, ${request.to})`)
        if (request.from === request.to)
            return {rate: 1, ...request, timestamp: Date.now(), path: []}

        const resp = await RateApi.fetch(`v4/rate/${request.from}/${request.to}`)
        const text: string = await resp.text()
        log.info(`Fetching rate ${request.from} => ${request.to} = ${resp.statusText}\n${text}`)
        return JSON.parse(text)
    }
}

class SymbolQuery implements Query<SymbolBackgroundMessage, Record<string, string>> {
    readonly key = BackgroundMessageType.getSymbols

    async handle(request: SymbolBackgroundMessage) {
        const resp = await RateApi.fetch(`v4/symbols`)
        const text: string = await resp.text()
        log.info(`Fetching symbols ${resp.statusText}\n${text}`)
        return JSON.parse(text)
    }
}