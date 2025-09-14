export function isCurrencyTag( value: any ): boolean {
    return typeof value === 'string' && /^[A-Z]{3}$/.test( value )
}
export type UUID = `${ string }-${ string }-${ string }-${ string }-${ string }`

export function generateUUID(): UUID {
    let dt = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, ( c ) => {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor( dt / 16 );
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString( 16 );
    } ) as UUID;
}