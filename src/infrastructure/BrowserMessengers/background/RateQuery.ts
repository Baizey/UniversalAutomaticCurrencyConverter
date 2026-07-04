import {Query} from "../messengerHandlerManager";
import {isCurrencyTag} from "../../../serviceWorker/utils";
import {BackendApiCaller} from "../../../serviceWorker/BackendApiCaller";
import {log} from "../../../di";

import {BackgroundMessageType} from "./BackgroundMessageType";

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

export type RatesResponse = {
    rates: RateResponse[]
}

export type RateBackgroundMessage = {
    type: BackgroundMessageType.getRate
    to: string
}

export class RateQuery implements Query<RateBackgroundMessage, RatesResponse> {
    readonly key = BackgroundMessageType.getRate

    async handle(request: RateBackgroundMessage): Promise<RatesResponse> {
        if (!isCurrencyTag(request.to))
            throw new Error(`Invalid currency tags given '${request.to}'`)

        log.info(`Fetching rate for ${request.to}`)
        return BackendApiCaller.fetchJson<RatesResponse>(`api/v1/market/rates/${request.to}`)
    }
}