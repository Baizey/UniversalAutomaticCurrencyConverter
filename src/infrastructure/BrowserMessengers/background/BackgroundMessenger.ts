import {Browser, BrowserDiTypes} from '../../index'
import {MessageResponse} from "../messengerHandlerManager";
import {RateBackgroundMessage, RateResponse} from "./RateQuery";
import {SymbolBackgroundMessage, SymbolResponse} from "./SymbolQuery";
import {BackgroundMessageType} from "./BackgroundMessageType";
import {DetectionBackgroundMessage, DetectionResponse} from "./DetectionQuery";
import {PseudoDom} from "../../../currencyConverter/Detection/pseudoDom";

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
        const result = await this.sendMessage<DetectionResponse>({type: BackgroundMessageType.detect, root: dom.root})
        return result.map(id => dom.element(id)).filter(e => e) as HTMLElement[]
    }

    async getRate(from: string, to: string): Promise<RateResponse> {
        return await this.sendMessage({type: BackgroundMessageType.getRate, to, from})
    }

    async getSymbols(): Promise<SymbolResponse> {
        return await this.sendMessage({type: BackgroundMessageType.getSymbols})
    }

    private async sendMessage<Response>(data: BackgroundMessage): Promise<Response> {
        const response = await this.browser.runtime.sendMessage(data) as MessageResponse<Response>
        if (!response.success) throw response.data
        return response.data
    }
}