import {Query} from "../messengerHandlerManager";
import {RateApi} from "../../../serviceWorker/RateApi";
import {log} from "../../../di";
import {BackgroundMessageType, SymbolBackgroundMessage} from "./BackgroundMessenger";

export class SymbolQuery implements Query<SymbolBackgroundMessage, Record<string, string>> {
    readonly key = BackgroundMessageType.getSymbols

    async handle(request: SymbolBackgroundMessage) {
        const resp = await RateApi.fetch(`v4/symbols`)
        const text: string = await resp.text()
        log.info(`Fetching symbols ${resp.statusText}\n${text}`)
        return JSON.parse(text)
    }
}