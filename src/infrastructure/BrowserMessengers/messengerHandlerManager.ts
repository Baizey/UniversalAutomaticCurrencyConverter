import {log} from "../../di";
import {BackgroundMessage} from "./background/BackgroundMessenger";
import {Browser, BrowserDiTypes} from "../index";

export class MessengerHandlerManager {
    private readonly queries: { [key: string]: Query<any, any> | undefined } = {}
    private readonly browser: Browser

    constructor({browser}: BrowserDiTypes) {
        this.browser = browser
    }

    listen() {
        const self = this
        this.browser.runtime.onMessage.addListener((request: BackgroundMessage, sender, senderResponse,): boolean => {
            self.handle(senderResponse, request.type, request).catch(err => {
                log.error(err)
                senderResponse({data: err, success: false})
            })
            return true
        })
    }

    add(query: Query<any, any>) {
        this.queries[query.key] = query
    }

    async handle(respond: (resp: MessageResponse) => void, key: string, request: any) {
        log.info(`Handling message ${key}`)
        const queryHandler = this.queries[key]
        log.debug(`Has handler: ${!!queryHandler}`)
        if (!queryHandler) return respond({
            success: false,
            data: `No handler for key '${key}'`,
        })

        try {
            const response = await queryHandler.handle(request)
            return respond({
                success: true,
                data: response,
            })
        } catch (e) {
            return respond({
                success: false,
                data: e as Error
            })
        }
    }

}

export type MessageResponse<T = any> =
    | { success: true, data: T }
    | { success: false, data: string | Error }

export interface Query<T, R> {
    readonly key: any

    handle(data: T): Promise<R>
}