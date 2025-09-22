import { useProvider } from "../di";

const baseUrl = "https://bloodguilty-squelchily-darlena.ngrok-free.app"

export class BackendApiCaller {
    static fetch( path: string,
                  init: {
                      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
                      body?: any;
                      headers?: Record<string, string>;
                      params?: Record<string, string | number | boolean>;
                  } = {} ): Promise<Response> {
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

        const headers: Record<string, string> = (init.headers ?? {})
        headers['ngrok-skip-browser-warning'] = 'true'
        if ( sessionId ) headers['Authorization'] = `Bearer ${ sessionId }`
        headers['x-traceid'] = traceId

        return fetch( `${ baseUrl }/${ path }`, {
            method: init.method ?? 'GET',
            body: init.body ? JSON.stringify( init.body ) : undefined,
            headers: headers,
        } )
    }
}