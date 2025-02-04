import {Query} from "../messengerHandlerManager";
import {isCurrencyTag} from "../../../serviceWorker/utils";
import {RateApi} from "../../../serviceWorker/RateApi";
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
    path: RatePath[];
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

        const resp = await RateApi.fetch(`v5/rates/${request.to}`)
        const text: string = await resp.text()
        log.info(`Fetching rate for ${request.to} = ${resp.statusText}\n${text}`)
        return JSON.parse(text)
    }
}