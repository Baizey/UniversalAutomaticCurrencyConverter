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
        const result = await this.sendMessage<number[]>(request)
        return result.map(id => dom.element(id)).filter(e => e) as HTMLElement[]
    }

    async getRate(from: string, to: string): Promise<RateResponse> {
        const request: BackgroundMessage = {type: BackgroundMessageType.getRate, to, from}
        return await this.sendMessage(request)
    }

    async getSymbols(): Promise<SymbolResponse> {
        const request: BackgroundMessage = {type: BackgroundMessageType.getSymbols}
        return await this.sendMessage(request)
    }

    private async sendMessage<Response>(data: BackgroundMessage): Promise<Response> {
        const response = this.browser.isServiceWorker
            ? await this.handleLocally<Response>(data)
            : await this.browser.runtime.sendMessage(data) as MessageResponse<Response>
        if (!response.success) throw response.data
        return response.data
    }

    private handleLocally<Response>(request: BackgroundMessage): Promise<MessageResponse<Response>> {
        const {backgroundHandlers} = useProvider()
        return new Promise(((resolve) => backgroundHandlers.handle(resp => resolve(resp), request.type, request)))
    }
}