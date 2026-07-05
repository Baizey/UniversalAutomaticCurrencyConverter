import {Query} from "../messengerHandlerManager";
import {BackendApiCaller} from "../../../serviceWorker/BackendApiCaller";
import {log} from "../../../di";

import {BackgroundMessageType} from "./BackgroundMessageType";

export type SymbolBackgroundMessage = {
    type: BackgroundMessageType.getSymbols
}
export type SymbolResponse = Record<string, string>

export class SymbolQuery implements Query<SymbolBackgroundMessage, SymbolResponse> {
    readonly key = BackgroundMessageType.getSymbols

    async handle(request: SymbolBackgroundMessage): Promise<SymbolResponse> {
        const resp = await BackendApiCaller.fetchJson<SymbolResponse>(`api/v1/market/symbols`)
        log.info(`Fetching symbols`)
        return resp
    }
}