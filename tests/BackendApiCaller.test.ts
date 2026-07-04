import { BackendApiCaller } from '../src/serviceWorker/BackendApiCaller'

describe( 'BackendApiCaller', () => {
    it( 'parses JSON responses', async () => {
        const response = new Response( '{"ok":true}', {
            status: 200,
            headers: { 'content-type': 'application/json' },
        } )

        await expect( BackendApiCaller.parseJson<{ ok: boolean }>( response, 'test/path' ) )
            .resolves.toEqual( { ok: true } )
    } )

    it( 'throws a useful error for HTML instead of exposing raw JSON.parse errors', async () => {
        const response = new Response( '<!DOCTYPE html><html><body>not json</body></html>', {
            status: 200,
            headers: { 'content-type': 'text/html' },
        } )

        await expect( BackendApiCaller.parseJson( response, 'api/v1/market/symbols' ) )
            .rejects.toThrow( 'Backend returned invalid JSON for api/v1/market/symbols' )
    } )

    it( 'throws a useful error for non-OK backend responses', async () => {
        const response = new Response( 'Forbidden', { status: 403, statusText: 'Forbidden' } )

        await expect( BackendApiCaller.parseJson( response, 'api/v1/market/symbols' ) )
            .rejects.toThrow( 'Backend request failed for api/v1/market/symbols: HTTP 403 Forbidden; body: Forbidden' )
    } )
} )
