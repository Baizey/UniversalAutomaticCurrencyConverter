import {useProvider} from "../di";

const baseUrl = "https://bloodguilty-squelchily-darlena.ngrok-free.app"

export type FetchOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
    params?: Record<string, string | number | boolean>;
}

export class BackendApiCaller {

    static fetchJson<T>(path: string, init: FetchOptions = {}): Promise<T> {
        const result = await fetch(path, init)
        const text = await result.text()
        try {
            return JSON.parse(text)
        } catch (e) {
            throw new Error(`Failed to parse JSON from ${path}: ${text}\nFull error:\n${e}`)
        }
    }

    static fetch(path: string,
                 init: FetchOptions = {}): Promise<Response> {
        if (path.startsWith('/')) path = path.substring(1)
        if (init.params) {
            path +=
                '?' +
                Object.entries(init.params)
                    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
                    .join('&')
        }

        const {userConfig} = useProvider()
        const sessionId = userConfig.userSessionId.value
        const traceId = userConfig.traceId.value

        const headers: Record<string, string> = (init.headers ?? {})
        if (sessionId) headers['Authorization'] = `Bearer ${sessionId}`
        headers['x-traceid'] = traceId

        return fetch(`${baseUrl}/${path}`, {
            method: init.method ?? 'GET',
            body: init.body ? JSON.stringify(init.body) : undefined,
            headers: {
                ...(headers || {}),
                // This is hardcoded, but we don't really care
                // It's for our own service and is just to avoid significant abuse.
                'x-apikey': 'a8685f3f-9955-4d80-bff8-a927be128ece',
            },
        })
    }
}