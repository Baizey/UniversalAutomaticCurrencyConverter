function randomString( length ) {
	let result = ''
	const characters = 'abcdefghijklmnopqrstuvwxyz'
	const charactersLength = characters.length
	let counter = 0
	while ( counter < length ) {
		result += characters.charAt( Math.floor( Math.random() * charactersLength ) )
		counter += 1
	}
	return result
}

export const createClassName: () => `uacc-${ string }-${ number }` = ( () => {
	let counter = 0
	return () => `uacc-${ randomString( 5 ) }-${ counter++ }`
} )()