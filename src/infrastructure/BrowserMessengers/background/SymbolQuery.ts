import { Query } from "../messengerHandlerManager";
import { BackendApiCaller } from "../../../serviceWorker/BackendApiCaller";
import { log } from "../../../di";

import { BackgroundMessageType } from "./BackgroundMessageType";

export type SymbolBackgroundMessage = {
    type: BackgroundMessageType.getSymbols
}
export type SymbolResponse = Record<string, string>

export class SymbolQuery implements Query<SymbolBackgroundMessage, SymbolResponse> {
    readonly key = BackgroundMessageType.getSymbols

    async handle( request: SymbolBackgroundMessage ) {
        log.info( `Fetching symbols ${ resp.statusText }\n${ text }` )
        return await BackendApiCaller.fetchJson( `api/v1/market/symbols` )
    }
}