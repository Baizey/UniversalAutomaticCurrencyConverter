import {Query} from "../messengerHandlerManager";
import {isCurrencyTag} from "../../../serviceWorker/utils";
import {RateApi} from "../../../serviceWorker/RateApi";
import {log} from "../../../di";
import {BackgroundMessageType, RateBackgroundMessage, RateResponse} from "./BackgroundMessenger";

export class RateQuery implements Query<RateBackgroundMessage, RateResponse> {
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