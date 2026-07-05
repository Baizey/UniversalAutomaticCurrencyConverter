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

type BackendRateResponse = {
    fromBase: number
    toBase: number
}

type BackendRatesResponse = {
    base: string
    rates: Record<string, BackendRateResponse>
    timestamp: string
    source: string
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

        log.info(`Fetching rates for ${request.to}`)
        const resp = await BackendApiCaller.fetchJson<BackendRatesResponse>(`api/v1/market/rates/${request.to}`)
        const timestamp = new Date(resp.timestamp).getTime()
        const rates = {
            ...resp.rates,
            [resp.base]: resp.rates[resp.base] ?? {fromBase: 1, toBase: 1},
        }

        return {
            rates: Object.entries(rates).map(([from, rate]) => ({
                from,
                to: resp.base,
                rate: rate.toBase,
                timestamp,
                path: [{
                    from,
                    to: resp.base,
                    source: resp.source,
                    rate: rate.toBase,
                    timestamp,
                }],
            })),
        }
    }
}