import { useProvider } from "../di";

const baseUrl = "https://uacc-go-h3a6bmejfnaebygu.northeurope-01.azurewebsites.net"

type BackendFetchInit = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
    params?: Record<string, string | number | boolean>;
}

function bodyPreview( text: string ): string {
    return text.replace( /\s+/g, ' ' ).trim().substring( 0, 300 )
}

export class BackendApiCaller {
    static fetch( path: string, init: BackendFetchInit = {} ): Promise<Response> {
        if ( path.startsWith( '/' ) ) path = path.substring( 1 )
        if ( init.params ) {
            path +=
                '?' +
                Object.entries( init.params )
                    .map( ( [ k, v ] ) => `${ k }=${ encodeURIComponent( v ) }` )
                    .join( '&' )
        }

        const { userConfig } = useProvider()
        const sessionId = userConfig.userSessionId.value
        const traceId = userConfig.traceId.value

        const headers: Record<string, string> = {
            Accept: 'application/json',
            ...( init.headers ?? {} ),
        }
        if ( init.body ) headers['Content-Type'] = headers['Content-Type'] ?? 'application/json'
        if ( sessionId ) headers['Authorization'] = `Bearer ${ sessionId }`
        headers['x-traceid'] = traceId

        return fetch( `${ baseUrl }/${ path }`, {
            method: init.method ?? 'GET',
            body: init.body ? JSON.stringify( init.body ) : undefined,
            headers: {
                ...(headers || {}),
                // This is hardcoded, but we don't really care
                // It's for our own service and is just to avoid significant abuse.
                'x-apikey': 'a8685f3f-9955-4d80-bff8-a927be128ece',
            },
        } )
    }

    static async fetchOk( path: string, init: BackendFetchInit = {} ): Promise<void> {
        const response = await BackendApiCaller.fetch( path, init )
        const text = await response.text()
        BackendApiCaller.assertOk( response, path, text )
    }

    static async fetchJson<T>( path: string, init: BackendFetchInit = {} ): Promise<T> {
        const response = await BackendApiCaller.fetch( path, init )
        return BackendApiCaller.parseJson<T>( response, path )
    }

    static async parseJson<T>( response: Response, path: string = response.url ): Promise<T> {
        const text = await response.text()
        BackendApiCaller.assertOk( response, path, text )

        try {
            return JSON.parse( text ) as T
        } catch ( error: unknown ) {
            const contentType = response.headers.get( 'content-type' ) ?? 'unknown'
            throw new Error(
                `Backend returned invalid JSON for ${ path }: HTTP ${ response.status } ${ response.statusText }; content-type: ${ contentType }; body: ${ bodyPreview( text ) || '<empty>' }`,
            )
        }
    }

    private static assertOk( response: Response, path: string, text: string ): void {
        const preview = bodyPreview( text )
        if ( !response.ok ) {
            throw new Error(
                `Backend request failed for ${ path }: HTTP ${ response.status } ${ response.statusText }${ preview ? `; body: ${ preview }` : '' }`,
            )
        }
    }
}