import {useProvider} from "../di";

enum BackendEnvironment {
    staging = 'staging',
    hosted = 'hosted',
}

const backendEnvironment: BackendEnvironment = BackendEnvironment.staging
const backendUrls = {
    [BackendEnvironment.staging]: 'https://bloodguilty-squelchily-darlena.ngrok-free.app',
    [BackendEnvironment.hosted]: 'https://uacc-go-h3a6bmejfnaebygu.northeurope-01.azurewebsites.net',
} satisfies Record<BackendEnvironment, string>

const baseUrl = backendUrls[backendEnvironment]

export type FetchOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
    params?: Record<string, string | number | boolean>;
}

export class BackendApiCaller {

    static async fetchJson<T>(path: string, init: FetchOptions = {}): Promise<T> {
        const result = await this.fetchOk(path, init)
        const text = await result.text()
        try {
            return JSON.parse(text)
        } catch (e) {
            throw new Error(`Failed to parse JSON from ${path}: ${result.status} ${result.statusText}\n${text}\nFull error:\n${e}`)
        }
    }

    static async fetchOk(path: string, init: FetchOptions = {}): Promise<Response> {
        const result = await this.fetch(path, init)
        if (!result.ok) {
            const text = await result.text()
            throw new Error(`Request failed for ${path}: ${result.status} ${result.statusText}\n${text}`)
        }
        return result
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

        const headers: Record<string, string> = {...(init.headers ?? {})}
        if (sessionId) headers['Authorization'] = `Bearer ${sessionId}`
        headers['Accept'] = 'application/json'
        headers['ngrok-skip-browser-warning'] = 'true'
        headers['X-Request-ID'] = traceId
        headers['x-traceid'] = traceId
        if (init.body) headers['Content-Type'] = 'application/json'

        return fetch(`${baseUrl}/${path}`, {
            method: init.method ?? 'GET',
            body: init.body ? JSON.stringify(init.body) : undefined,
            headers: {
                ...headers,
                // This is hardcoded, but we don't really care
                // It's for our own service and is just to avoid significant abuse.
                'x-apikey': 'a8685f3f-9955-4d80-bff8-a927be128ece',
            },
        })
    }
}