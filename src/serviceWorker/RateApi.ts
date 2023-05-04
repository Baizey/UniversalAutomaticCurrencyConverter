export class RateApi {
    static fetch(path: string,
                 init: {
                     method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
                     body?: any;
                     headers?: Record<string, string>;
                     params?: Record<string, string>;
                 } = {}): Promise<Response> {
        if (path.startsWith('/')) path = path.substr(1, path.length)
        if (init.params) {
            path +=
                '?' +
                Object.entries(init.params)
                    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
                    .join('&')
        }
        return fetch(`https://uacc-bff-api.azurewebsites.net/api/${path}`, {
            method: init?.method || 'GET',
            body: init.body ? JSON.stringify(init.body) : undefined,
            headers: {
                ...(init.headers || {}),
                'x-apikey': 'a8685f3f-9955-4d80-bff8-a927be128ece',
            },
        })
    }

}