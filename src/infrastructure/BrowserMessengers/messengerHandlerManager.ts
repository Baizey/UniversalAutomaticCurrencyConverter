export class MessengerHandlerManager {
    private queries: { [key: string]: Query<any, any> } = {}

    add(query: Query<any, any>) {
        this.queries[query.key] = query
    }

    async handle(respond: (resp: MessageResponse) => void, key: string, request: any) {
        const queryHandler = this.queries[key]
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