import {Browser, BrowserDiTypes} from '../../index'
import {MessageResponse} from "../messengerHandlerManager";
import {RateBackgroundMessage, RateResponse} from "./RateQuery";
import {SymbolBackgroundMessage, SymbolResponse} from "./SymbolQuery";
import {BackgroundMessageType} from "./BackgroundMessageType";
import {DetectionBackgroundMessage} from "./DetectionQuery";
import {PseudoDom} from "../../../currencyConverter/Detection/pseudoDom";
import {useProvider} from "../../../di";

export type BackgroundMessage =
    | RateBackgroundMessage
    | SymbolBackgroundMessage
    | DetectionBackgroundMessage

export class BackgroundMessenger {
    private readonly browser: Browser

    constructor({browser}: BrowserDiTypes) {
        this.browser = browser
    }

    async findCurrencyHolders(dom: PseudoDom): Promise<HTMLElement[]> {
        const request: BackgroundMessage = {type: BackgroundMessageType.detect, root: dom.root}
        let result: number[]
        if (this.browser.isServiceWorker)
            result = await this.handleLocally(request)
        else
            result = await this.sendMessage(request)
        return result.map(id => dom.element(id)).filter(e => e) as HTMLElement[]
    }

    async getRate(from: string, to: string): Promise<RateResponse> {
        const request: BackgroundMessage = {type: BackgroundMessageType.getRate, to, from}
        if (this.browser.isServiceWorker)
            return await this.handleLocally(request)
        else
            return await this.sendMessage(request)
    }

    async getSymbols(): Promise<SymbolResponse> {
        const request: BackgroundMessage = {type: BackgroundMessageType.getSymbols}
        if (this.browser.isServiceWorker)
            return await this.handleLocally(request)
        else
            return await this.sendMessage(request)
    }

    private handleLocally<Response>(request: BackgroundMessage): Promise<Response> {
        const {backgroundHandlers} = useProvider()
        return new Promise(((resolve, reject) => {
            backgroundHandlers.handle(resp => {
                if (resp.success) resolve(resp.data)
                else reject(resp.data)
            }, request.type, request)
        }))
    }

    private async sendMessage<Response>(data: BackgroundMessage): Promise<Response> {
        const response = await this.browser.runtime.sendMessage(data) as MessageResponse<Response>
        if (!response.success) throw response.data
        return response.data
    }
}