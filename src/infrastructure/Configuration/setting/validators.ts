export const isBool = ( e: any ) => typeof e === 'boolean'

export const isNumber = ( e: any ) => typeof e === 'number' && !isNaN( e ) && Number.isFinite( e )
export const isInt = ( e: any ) => isNumber( e ) && Math.floor( e ) === e
export const isPositive = ( e: any ) => isNumber( e ) && e >= 0
export const isPositiveInt = ( e: any ) => isPositive( e ) && isInt( e )

export const isString = ( e: any ) => typeof e === 'string'
export const isOneOf = ( e: any, arr: any[] ) => arr.indexOf( e ) >= 0
export const isOfEnum = ( e: any, enu: object ) => isOneOf( e, Object.values( enu ) )
export const hasLength = ( e: any, length: number ) => isString( e ) && e.length === length
export const hasLengthRange = ( e: any, min: number, max: number ) =>
	isString( e ) && min <= e.length && e.length <= max
export const hasRegexMatch = ( e: any, match: RegExp ) => isString( e ) && match.test( e )

export const isArray = ( e: any ) => Array.isArray( e )
export const isDistinctArray = ( e: any ) => isArray( e ) && new Set( e ).size === e.length
export const isStringArray = ( e: any ) => isArray( e ) && e.every( isString )
export const isArrayWithRegexMatch = ( e: any, match: RegExp ) =>
	isArray( e ) && e.every( ( a: any ) => hasRegexMatch( a, match ) )